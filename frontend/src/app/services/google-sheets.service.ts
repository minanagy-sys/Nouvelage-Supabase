import { Injectable } from '@angular/core';

interface FormData {
  name: string;
  phone: string;
  email: string;
  birthday?: string;
  branch?: string;
  topic?: string;
  doctor?: string;
  treatment?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  private readonly GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbx2beL5br2VzfCoXryODQ-_UqnsGd4M0bhVYRGM6-nfpg1LRV9Bi65Cy3hQlFmoz0_e7A/exec';
  private readonly WHATSAPP_NUMBER = '201000312528';

  constructor() { }

  async sendToGoogleSheets(formData: FormData, formType: string): Promise<{ success: boolean; error?: string }> {
    const dataToSend = {
      formType: formType,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      name: formData.name || '',
      phone: formData.phone || '',
      email: formData.email || '',
      birthday: formData.birthday || '',
      branch: formData.branch || '',
      topic: formData.topic || '',
      message: formData.message || '',
      doctor: formData.doctor || '',
      treatment: formData.treatment || ''
    };

    console.log('📤 Sending to Google Sheets:', dataToSend);

    try {
      await fetch(this.GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('✅ Data sent to Google Sheets successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error sending data:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  redirectToWhatsApp(formData: FormData): void {
    const message = this.buildWhatsAppMessage(formData);
    const whatsappUrl = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    console.log('📱 Redirecting to WhatsApp...');
    window.open(whatsappUrl, '_blank', 'noopener');
  }

  private buildWhatsAppMessage(formData: FormData): string {
    let message = "New inquiry — Nouvel Age\n";
    message += `Name: ${formData.name}\n`;
    message += `Phone: ${formData.phone}`;

    if (formData.email) message += `\nEmail: ${formData.email}`;
    if (formData.birthday) message += `\nBirthday: ${formData.birthday}`;
    if (formData.branch) message += `\nPreferred Branch: ${formData.branch}`;
    if (formData.topic) message += `\nTopic: ${formData.topic}`;
    if (formData.doctor) message += `\nPreferred Doctor: ${formData.doctor}`;
    if (formData.treatment) message += `\nInterested Treatment: ${formData.treatment}`;
    if (formData.message) message += `\nMessage: ${formData.message}`;

    return message;
  }

  validateEgyptianPhone(phone: string): boolean {
    const egyptianPhoneRegex = /^(\+20|0020)?0?1[0-2|5]{1}[0-9]{8}$/;
    return egyptianPhoneRegex.test(phone.replace(/[\s-]/g, ''));
  }

  validateAge(birthday: string): boolean {
    const birthdayDate = new Date(birthday);
    const maxDate = new Date('2008-12-31');
    return birthdayDate <= maxDate;
  }
}
