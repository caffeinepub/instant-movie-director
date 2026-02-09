import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Rocket, Terminal, Globe, CheckCircle2 } from 'lucide-react';

export default function PublishHelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Rocket className="h-4 w-4" />
          Publish / Deploy
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Rocket className="h-6 w-6" />
            Deploy Instant Movie Director
          </DialogTitle>
          <DialogDescription>
            Step-by-step instructions for deploying your application to the Internet Computer
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(85vh-8rem)] pr-4">
          <div className="space-y-6">
            {/* Prerequisites */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Prerequisites
              </h3>
              <div className="space-y-2 text-sm">
                <p>Before deploying, ensure you have the following installed:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <strong>dfx</strong> (Internet Computer SDK) - Install from{' '}
                    <code className="bg-muted px-1 py-0.5 rounded">sh.dfinity.org</code>
                  </li>
                  <li>
                    <strong>Node.js</strong> (v18 or later) and <strong>pnpm</strong>
                  </li>
                  <li>A code editor and terminal access</li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Local Development Deployment */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Local Development Deployment
              </h3>
              <div className="space-y-3 text-sm">
                <p>Deploy to your local Internet Computer replica for testing:</p>
                
                <div className="space-y-2">
                  <p className="font-medium">Step 1: Start the local replica</p>
                  <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                    <code>dfx start --clean --background</code>
                  </pre>
                  <p className="text-muted-foreground text-xs">
                    This starts a local Internet Computer node in the background. The <code>--clean</code> flag ensures a fresh state.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Step 2: Deploy the canisters</p>
                  <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                    <code>dfx deploy</code>
                  </pre>
                  <p className="text-muted-foreground text-xs">
                    This builds and deploys both the backend and frontend canisters to your local replica.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Step 3: Access your application</p>
                  <p className="text-muted-foreground">
                    After deployment completes, dfx will display URLs for your canisters. Look for output like:
                  </p>
                  <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs">
                    <code>{`Frontend canister via browser
  frontend: http://127.0.0.1:4943/?canisterId=<canister-id>
Backend canister via Candid interface:
  backend: http://127.0.0.1:4943/?canisterId=<candid-ui-id>&id=<backend-id>`}</code>
                  </pre>
                  <p className="text-muted-foreground text-xs mt-2">
                    Open the frontend URL in your browser to use Instant Movie Director locally.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Canister IDs</p>
                  <p className="text-muted-foreground text-xs">
                    Your local canister IDs are stored in <code>.dfx/local/canister_ids.json</code>
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Mainnet Deployment */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Internet Computer Mainnet Deployment
              </h3>
              <div className="space-y-3 text-sm">
                <p>Deploy to the public Internet Computer mainnet:</p>
                
                <div className="space-y-2">
                  <p className="font-medium">Step 1: Ensure you have cycles</p>
                  <p className="text-muted-foreground text-xs">
                    Deploying to mainnet requires cycles (the Internet Computer's compute unit). You can obtain cycles through:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground text-xs">
                    <li>The free cycles faucet (for testing)</li>
                    <li>Converting ICP tokens to cycles</li>
                    <li>Using a cycles wallet</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Step 2: Deploy to mainnet</p>
                  <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                    <code>dfx deploy --network ic</code>
                  </pre>
                  <p className="text-muted-foreground text-xs">
                    The <code>--network ic</code> flag targets the mainnet instead of your local replica.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Step 3: Access your live application</p>
                  <p className="text-muted-foreground text-xs">
                    After successful deployment, your app will be accessible at:
                  </p>
                  <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs">
                    <code>https://{'<frontend-canister-id>'}.ic0.app</code>
                  </pre>
                  <p className="text-muted-foreground text-xs mt-2">
                    Replace <code>{'<frontend-canister-id>'}</code> with your actual frontend canister ID from the deployment output.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Mainnet Canister IDs</p>
                  <p className="text-muted-foreground text-xs">
                    Your mainnet canister IDs are stored in <code>canister_ids.json</code> at the project root.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Expected Artifacts */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Expected Artifacts</h3>
              <div className="space-y-2 text-sm">
                <p>After deployment, you'll have:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground text-xs">
                  <li>
                    <strong>Backend canister</strong>: Stores all movie projects, prompts, and user profiles
                  </li>
                  <li>
                    <strong>Frontend canister</strong>: Serves the React application
                  </li>
                  <li>
                    <strong>Canister IDs</strong>: Unique identifiers for your canisters (stored in JSON files)
                  </li>
                  <li>
                    <strong>Public URL</strong>: Your application accessible at <code>{'<canister-id>'}.ic0.app</code> (mainnet only)
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            {/* Troubleshooting */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Troubleshooting</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Build errors</p>
                  <p className="text-muted-foreground text-xs">
                    Run <code className="bg-muted px-1 py-0.5 rounded">pnpm install</code> in the frontend directory to ensure all dependencies are installed.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Deployment fails with "out of cycles"</p>
                  <p className="text-muted-foreground text-xs">
                    You need to add cycles to your wallet. Use the cycles faucet or convert ICP tokens.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Cannot access local deployment</p>
                  <p className="text-muted-foreground text-xs">
                    Ensure <code className="bg-muted px-1 py-0.5 rounded">dfx start</code> is running. Check the terminal for any error messages.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Frontend shows blank page</p>
                  <p className="text-muted-foreground text-xs">
                    Check browser console for errors. Ensure the backend canister deployed successfully and the frontend can connect to it.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Additional Resources */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Additional Resources</h3>
              <div className="space-y-2 text-sm">
                <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground text-xs">
                  <li>Internet Computer Documentation: internetcomputer.org/docs</li>
                  <li>dfx Command Reference: internetcomputer.org/docs/current/references/cli-reference</li>
                  <li>Cycles Faucet: internetcomputer.org/docs/current/developer-docs/setup/cycles/cycles-faucet</li>
                </ul>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
