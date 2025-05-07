
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from "@/components/Head";
import { Separator } from "@/components/ui/separator";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Head 
        title="Terms of Service" 
        description="MemeSmith Terms of Service - Please read these terms and conditions carefully before using our service."
      />
      
      <Header />
      
      <main className="container px-4 mx-auto flex-1 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-4">Last updated: May 7, 2025</p>
          
          <Separator className="my-6" />
          
          <div className="prose dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By using MemeSmith, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily use MemeSmith for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose;</li>
              <li>attempt to decompile or reverse engineer any software contained on MemeSmith;</li>
              <li>remove any copyright or other proprietary notations from the materials;</li>
              <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            
            <h2>3. Content Creation and Sharing</h2>
            <p>
              Users are responsible for the content they create and share using MemeSmith. Content that violates copyright, 
              is unlawful, defamatory, obscene, or invasive of privacy is prohibited. MemeSmith reserves the right to remove 
              any content that violates these terms.
            </p>
            
            <h2>4. Pro Subscriptions</h2>
            <p>
              Pro subscriptions are billed according to the fees in effect at the time of purchase. Subscriptions automatically 
              renew unless canceled at least 24 hours before the end of the current billing period. Refunds are issued at the 
              discretion of MemeSmith.
            </p>
            
            <h2>5. Limitations</h2>
            <p>
              In no event shall MemeSmith or its suppliers be liable for any damages (including, without limitation, damages 
              for loss of data or profit, or due to business interruption) arising out of the use or inability to use 
              MemeSmith, even if MemeSmith or an authorized representative has been notified orally or in writing of the 
              possibility of such damage.
            </p>
            
            <h2>6. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably 
              submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
