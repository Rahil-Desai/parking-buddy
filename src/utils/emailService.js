import emailjs from '@emailjs/browser';

// EmailJS Configuration from environment variables
const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  TEMPLATE_ID: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  PUBLIC_KEY: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
};

// Debug: Log EmailJS configuration
console.log('🔧 EmailJS Configuration:', {
  SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID,
  TEMPLATE_ID: EMAILJS_CONFIG.TEMPLATE_ID,
  PUBLIC_KEY: EMAILJS_CONFIG.PUBLIC_KEY ? '***' + EMAILJS_CONFIG.PUBLIC_KEY.slice(-4) : 'NOT_SET',
  IS_CONFIGURED: EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
});

// Debug: Log raw environment variables
console.log('🔧 Raw Environment Variables:', {
  REACT_APP_EMAILJS_SERVICE_ID: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  REACT_APP_EMAILJS_TEMPLATE_ID: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  REACT_APP_EMAILJS_PUBLIC_KEY: process.env.REACT_APP_EMAILJS_PUBLIC_KEY ? '***' + process.env.REACT_APP_EMAILJS_PUBLIC_KEY.slice(-4) : 'NOT_SET'
});

// Initialize EmailJS only if credentials are provided
if (EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

export const emailService = {
  // Send password reset email
  async sendPasswordResetEmail(userEmail) {
    try {
      // Check if EmailJS is properly configured
      if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        console.warn('EmailJS not configured. Using mock email service.');
        return this.sendMockEmail('passwordReset', userEmail);
      }

      const templateParams = {
        email: userEmail,
        reset_link: `${window.location.origin}/reset-password?email=${encodeURIComponent(userEmail)}&token=${this.generateToken()}`,
        message: 'You requested a password reset for your Parking Buddy account.',
      };

      console.log('📧 Sending password reset email to:', userEmail);
      console.log('📧 Using template params:', templateParams);
      
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('✅ Password reset email sent successfully:', response);
      return { success: true, message: 'Password reset email sent successfully!' };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        status: error.status
      });
      return { success: false, message: 'Failed to send email. Please try again.' };
    }
  },

  // Send email verification code
  async sendVerificationEmail(userEmail, verificationCode) {
    try {
      // Check if EmailJS is properly configured
      if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        console.warn('EmailJS not configured. Using mock email service.');
        return this.sendMockEmail('verification', userEmail, verificationCode);
      }

      const templateParams = {
        email: userEmail,
        code: verificationCode,
        message: 'Please verify your email address to complete your Parking Buddy registration.',
      };

      console.log('📧 Sending verification email to:', userEmail);
      console.log('📧 Using template params:', templateParams);
      
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('✅ Verification email sent successfully:', response);
      return { success: true, message: 'Verification email sent successfully!' };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        status: error.status
      });
      return { success: false, message: 'Failed to send email. Please try again.' };
    }
  },

  // Generate a simple token for password reset
  generateToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  },

  // Generate a 6-digit verification code
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Mock email service for development/testing
  async sendMockEmail(type, userEmail, code = null) {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const emailContent = {
      passwordReset: {
        subject: 'Password Reset - Parking Buddy',
        body: `
          Hello,
          
          You requested a password reset for your Parking Buddy account.
          
          Reset Link: ${window.location.origin}/reset-password?email=${encodeURIComponent(userEmail)}&token=${this.generateToken()}
          
          If you didn't request this, please ignore this email.
          
          Best regards,
          Parking Buddy Team
        `
      },
      verification: {
        subject: 'Email Verification - Parking Buddy',
        body: `
          Hello,
          
          Thank you for registering with Parking Buddy!
          
          Your verification code is: ${code}
          
          Please enter this code to complete your registration.
          
          Best regards,
          Parking Buddy Team
        `
      }
    };

    console.log('📧 EMAIL SENT:');
    console.log('To:', userEmail);
    console.log('Subject:', emailContent[type].subject);
    console.log('Body:', emailContent[type].body);
    console.log('---');

    return { success: true, message: `Email sent to ${userEmail}` };
  }
}; 