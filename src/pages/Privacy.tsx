
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from "@/components/Head";
import { Separator } from "@/components/ui/separator";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Head 
        title="Privacy Policy" 
        description="MemeSmith Privacy Policy - Learn how we collect, use, and protect your personal information."
      />
      
      <Header />
      
      <main className="container px-4 mx-auto flex-1 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-4">Last updated: May 7, 2025</p>
          
          <Separator className="my-6" />
          
          <div className="prose dark:prose-invert max-w-none">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, such as your email address, 
              username, and other profile information. We also collect information about your use of MemeSmith, including 
              the memes you create and your interactions with the service.
            </p>
            
            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to operate and improve MemeSmith, personalize your experience, and 
              communicate with you about your account and our services. We may also use your information to detect and 
              prevent fraudulent activity and ensure the security of our platform.
            </p>
            
            <h2>3. Information Sharing</h2>
            <p>
              We do not sell your personal information to third parties. We may share your information with service 
              providers who help us operate MemeSmith, such as payment processors and hosting providers. We may also 
              disclose your information if required by law or to protect our rights.
            </p>
            
            <h2>4. Cookies and Tracking Technologies</h2>
            <p>
              MemeSmith uses cookies and similar tracking technologies to track activity on our service and hold certain 
              information, including your preferences and authentication status. You can instruct your browser to refuse all 
              cookies or to indicate when a cookie is being sent.
            </p>
            
            <h2>5. Data Security</h2>
            <p>
              We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized 
              access, disclosure, alteration, and destruction. However, no security system is impenetrable, and we cannot 
              guarantee the security of your information.
            </p>
            
            <h2>6. Children's Privacy</h2>
            <p>
              MemeSmith is not intended for children under 13 years of age. We do not knowingly collect personal information 
              from children under 13. If you are a parent or guardian and believe we may have collected information from a 
              child under 13, please contact us.
            </p>
            
            <h2>7. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
