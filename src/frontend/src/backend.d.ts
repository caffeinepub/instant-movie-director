import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Metadata {
    narrativeStructure?: Variant_episodic_nonLinear_linear;
    originalLanguage?: string;
    productionScope?: Variant_large_small_medium;
    visualStyle?: string;
    tone?: Variant_humorous_dark_serious_lighthearted;
    complexityLevel?: Variant_complex_simple_moderate;
    intendedAudience?: string;
    genre?: string;
    scriptFormat?: Variant_animated_standard_musical;
    runtime?: Variant_short_featureLength;
}
export type ProjectId = bigint;
export interface Prompt {
    title: string;
    promptText: string;
    promptType: PromptType;
    systemMessage?: string;
    project: ProjectId;
}
export interface Project {
    title: string;
    scenes: Array<Scene>;
    metadata?: Metadata;
    user: Principal;
    logLine: string;
    synopsis: string;
    roles: Array<string>;
    prompts: Array<Prompt>;
}
export interface UserProfile {
    name: string;
}
export interface Scene {
    title: string;
    description: string;
}
export enum PromptType {
    role = "role",
    scene = "scene",
    location = "location"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_animated_standard_musical {
    animated = "animated",
    standard = "standard",
    musical = "musical"
}
export enum Variant_complex_simple_moderate {
    complex = "complex",
    simple = "simple",
    moderate = "moderate"
}
export enum Variant_episodic_nonLinear_linear {
    episodic = "episodic",
    nonLinear = "nonLinear",
    linear = "linear"
}
export enum Variant_humorous_dark_serious_lighthearted {
    humorous = "humorous",
    dark = "dark",
    serious = "serious",
    lighthearted = "lighthearted"
}
export enum Variant_large_small_medium {
    large = "large",
    small = "small",
    medium = "medium"
}
export enum Variant_short_featureLength {
    short_ = "short",
    featureLength = "featureLength"
}
export interface backendInterface {
    addPromptEntry(prompt: Prompt): Promise<ProjectId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createMovieProject(newProject: Project): Promise<ProjectId>;
    createPromptEntry(prompt: Prompt): Promise<Prompt>;
    deleteMovieProject(projectId: ProjectId): Promise<void>;
    getAllUserProjects(): Promise<Array<Project>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMovieProject(projectId: ProjectId): Promise<Project>;
    getPrompt(promptId: ProjectId): Promise<Prompt>;
    getPromptEntries(): Promise<Array<Prompt>>;
    getRolePromptEntries(): Promise<Array<Prompt>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMovieProject(projectId: ProjectId, updatedProject: Project): Promise<void>;
}
