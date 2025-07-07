import { Quote } from '@/types/quotes';
import { formatCurrency, formatArea } from '@/lib/calculator-utils';

export class EmailService {
  // For development, we'll simulate email sending
  // In production, you'd integrate with SendGrid, Resend, or similar service
  
  async sendQuote(quote: Quote, customMessage?: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate email content
      const emailContent = this.generateQuoteEmailHTML(quote, customMessage);
      
      // In development, we'll just log the email and show success
      console.log('📧 Email would be sent to:', quote.client_email);
      console.log('📄 Quote Number:', quote.quote_number);
      console.log('💰 Total Cost:', formatCurrency(quote.total_cost));
      
      // Store sent status in localStorage (simulating email service response)
      const sentEmails = this.getSentEmails();
      sentEmails.push({
        quote_id: quote.id,
        recipient: quote.client_email,
        subject: `Quote ${quote.quote_number} - ${quote.project_name}`,
        sent_at: new Date().toISOString(),
        status: 'delivered'
      });
      localStorage.setItem('pakeaja-sent-emails', JSON.stringify(sentEmails));
      
      return { success: true };
      
    } catch (error) {
      console.error('Email sending failed:', error);
      return { 
        success: false, 
        error: 'Failed to send email. Please try again.' 
      };
    }
  }
  
  private generateQuoteEmailHTML(quote: Quote, customMessage?: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Quote ${quote.quote_number}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .quote-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .cost-summary { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PakeAja CRM</h1>
          <p>Solusi CRM Coating & Painting</p>
        </div>
        
        <div class="content">
          <h2>Dear ${quote.client_name},</h2>
          
          ${customMessage ? `<p>${customMessage}</p>` : `
          <p>Terima kasih atas minat Anda terhadap layanan coating kami. Berikut adalah penawaran harga terperinci:</p>
          `}
          
          <div class="quote-details">
            <h3>Quote Details</h3>
            <p><strong>Quote Number:</strong> ${quote.quote_number}</p>
            <p><strong>Project:</strong> ${quote.project_name}</p>
            <p><strong>Project Date:</strong> ${new Date(quote.project_date).toLocaleDateString()}</p>
            <p><strong>Total Area:</strong> ${formatArea(quote.total_area)}</p>
            <p><strong>Quote Date:</strong> ${new Date(quote.created_at).toLocaleDateString()}</p>
            <p><strong>Valid Until:</strong> ${quote.expires_at ? new Date(quote.expires_at).toLocaleDateString() : 'Contact us'}</p>
          </div>
          
          ${quote.calculator_data.selectedSystem ? `
          <div class="quote-details">
            <h3>Coating System</h3>
            <p><strong>${quote.calculator_data.selectedSystem.name}</strong></p>
            <p>${quote.calculator_data.selectedSystem.description}</p>
            <p>Thickness: ${quote.calculator_data.selectedSystem.totalThickness} mils | Warranty: ${quote.calculator_data.selectedSystem.warranty} years</p>
          </div>
          ` : ''}
          
          <div class="cost-summary">
            <h3>Cost Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px;"><strong>Total Project Cost:</strong></td>
                <td style="padding: 8px; text-align: right;"><strong>${formatCurrency(quote.total_cost)}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px;">Biaya per m²:</td>
                <td style="padding: 8px; text-align: right;">${formatCurrency(quote.cost_per_sqft)}</td>
              </tr>
            </table>
          </div>
          
          <p>Untuk melanjutkan penawaran ini atau jika ada pertanyaan, silakan hubungi kami:</p>
          <ul>
            <li>Email: info@pakeaja.com</li>
            <li>Phone: 021-2345-6789</li>
          </ul>
          
          <p>Kami berharap dapat bekerja sama dengan Anda dalam proyek coating ini.</p>
          
          <p>Hormat kami,<br>
          Tim PakeAja CRM</p>
        </div>
        
        <div class="footer">
          <p>PakeAja CRM - Solusi CRM Coating & Painting</p>
          <p>Penawaran ini dibuat secara otomatis dan berlaku selama 30 hari dari tanggal penerbitan.</p>
        </div>
      </body>
      </html>
    `;
  }
  
  private getSentEmails(): any[] {
    try {
      const stored = localStorage.getItem('pakeaja-sent-emails');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  
  // Get email history for a quote
  async getEmailHistory(quoteId: string): Promise<any[]> {
    const sentEmails = this.getSentEmails();
    return sentEmails.filter(email => email.quote_id === quoteId);
  }
  
  // Check if quote has been sent
  async isQuoteSent(quoteId: string): Promise<boolean> {
    const sentEmails = this.getSentEmails();
    return sentEmails.some(email => email.quote_id === quoteId);
  }
}

export const emailService = new EmailService();