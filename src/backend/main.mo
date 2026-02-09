import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  type PromptType = { #role; #location; #scene };
  type ProjectId = Nat;

  public type Metadata = {
    genre : ?Text;
    scriptFormat : ?{ #standard; #musical; #animated };
    intendedAudience : ?Text;
    complexityLevel : ?{ #simple; #moderate; #complex };
    runtime : ?{ #short; #featureLength };
    visualStyle : ?Text;
    tone : ?{ #serious; #humorous; #dark; #lighthearted };
    narrativeStructure : ?{ #linear; #nonLinear; #episodic };
    productionScope : ?{ #small ; #medium ; #large };
    originalLanguage : ?Text;
  };

  public type Prompt = {
    project : ProjectId;
    promptText : Text;
    systemMessage : ?Text;
    promptType : PromptType;
    title : Text;
  };

  type Scene = {
    title : Text;
    description : Text;
  };

  public type Project = {
    user : Principal;
    scenes : [Scene];
    roles : [Text];
    logLine : Text;
    title : Text;
    synopsis : Text;
    prompts : [Prompt];
    metadata : ?Metadata;
  };

  public type UserProfile = {
    name : Text;
  };

  let persistedProjects = Map.empty<ProjectId, Project>();
  let promptEntries = Map.empty<ProjectId, Prompt>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextProjectId : Nat = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createMovieProject(newProject : Project) : async ProjectId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create projects");
    };

    if (newProject.user != caller) {
      Runtime.trap("Unauthorized: Cannot create project for another user");
    };

    let projectId = nextProjectId;
    nextProjectId += 1;
    persistedProjects.add(projectId, newProject);
    projectId;
  };

  public query ({ caller }) func getMovieProject(projectId : ProjectId) : async Project {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };

    switch (persistedProjects.get(projectId)) {
      case (?project) {
        if (project.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own projects");
        };
        project;
      };
      case (null) { Runtime.trap("Project not found") };
    };
  };

  public shared ({ caller }) func updateMovieProject(projectId : ProjectId, updatedProject : Project) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update projects");
    };

    switch (persistedProjects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?existingProject) {
        if (existingProject.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only project owner can update project");
        };
        if (updatedProject.user != existingProject.user) {
          Runtime.trap("Cannot change project owner");
        };
        persistedProjects.add(projectId, updatedProject);
      };
    };
  };

  public shared ({ caller }) func deleteMovieProject(projectId : ProjectId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete projects");
    };

    switch (persistedProjects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?existingProject) {
        if (existingProject.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only project owner can delete project");
        };
        persistedProjects.remove(projectId);
        for ((id, prompt) in promptEntries.entries()) {
          if (prompt.project == projectId) {
            promptEntries.remove(id);
          };
        };
      };
    };
  };

  public query ({ caller }) func getAllUserProjects() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = List.empty<Project>();

    for (project in persistedProjects.values()) {
      if (isAdmin or project.user == caller) {
        filtered.add(project);
      };
    };

    filtered.toArray();
  };

  public shared ({ caller }) func addPromptEntry(prompt : Prompt) : async ProjectId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add prompts");
    };

    switch (persistedProjects.get(prompt.project)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        if (project.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only add prompts to your own projects");
        };
      };
    };

    let promptId = nextProjectId;
    nextProjectId += 1;
    promptEntries.add(promptId, prompt);
    promptId;
  };

  public shared ({ caller }) func createPromptEntry(prompt : Prompt) : async Prompt {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create prompts");
    };

    switch (persistedProjects.get(prompt.project)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        if (project.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only create prompts for your own projects");
        };
      };
    };

    let promptId = nextProjectId;
    nextProjectId += 1;
    promptEntries.add(promptId, prompt);
    prompt;
  };

  public query ({ caller }) func getPrompt(promptId : ProjectId) : async Prompt {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view prompts");
    };

    switch (promptEntries.get(promptId)) {
      case (?prompt) {
        switch (persistedProjects.get(prompt.project)) {
          case (?project) {
            if (project.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Can only view prompts from your own projects");
            };
            prompt;
          };
          case (null) { Runtime.trap("Associated project not found") };
        };
      };
      case (null) { Runtime.trap("Prompt not found") };
    };
  };

  public query ({ caller }) func getPromptEntries() : async [Prompt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view prompts");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = List.empty<Prompt>();

    for (prompt in promptEntries.values()) {
      switch (persistedProjects.get(prompt.project)) {
        case (?project) {
          if (isAdmin or project.user == caller) {
            filtered.add(prompt);
          };
        };
        case (null) {};
      };
    };

    filtered.toArray();
  };

  public query ({ caller }) func getRolePromptEntries() : async [Prompt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view prompts");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = List.empty<Prompt>();

    for (prompt in promptEntries.values()) {
      if (prompt.promptType == #role) {
        switch (persistedProjects.get(prompt.project)) {
          case (?project) {
            if (isAdmin or project.user == caller) {
              filtered.add(prompt);
            };
          };
          case (null) {};
        };
      };
    };

    filtered.toArray();
  };
};

