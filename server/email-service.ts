import { ENV } from "./_core/env";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email using Manus Notification API
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const response = await fetch(`${ENV.forgeApiUrl}/notification/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        html: options.html,
        from: options.from || "Möbelhaus <noreply@manus.space>",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Email] Failed to send email:", error);
      return false;
    }

    console.log(`[Email] Successfully sent email to ${options.to}`);
    return true;
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
  variantColor?: string;
}

interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
  shippingAddress: string;
  language: 'de' | 'en';
}

/**
 * Generate HTML email template for order confirmation
 */
export function generateOrderConfirmationEmail(data: OrderConfirmationData): string {
  const isGerman = data.language === 'de';
  
  const translations = {
    title: isGerman ? 'Bestellbestätigung' : 'Order Confirmation',
    greeting: isGerman ? 'Sehr geehrte/r' : 'Dear',
    thankYou: isGerman 
      ? 'Vielen Dank für Ihre Bestellung bei Möbelhaus! Wir haben Ihre Zahlung erhalten und werden Ihre Bestellung schnellstmöglich bearbeiten.' 
      : 'Thank you for your order at Möbelhaus! We have received your payment and will process your order as soon as possible.',
    orderDetails: isGerman ? 'Bestelldetails' : 'Order Details',
    orderNumber: isGerman ? 'Bestellnummer' : 'Order Number',
    product: isGerman ? 'Produkt' : 'Product',
    quantity: isGerman ? 'Menge' : 'Quantity',
    price: isGerman ? 'Preis' : 'Price',
    subtotal: isGerman ? 'Zwischensumme' : 'Subtotal',
    shipping: isGerman ? 'Versand' : 'Shipping',
    total: isGerman ? 'Gesamtsumme' : 'Total',
    shippingAddress: isGerman ? 'Lieferadresse' : 'Shipping Address',
    shippingMethod: isGerman ? 'Versandart' : 'Shipping Method',
    nextSteps: isGerman ? 'Nächste Schritte' : 'Next Steps',
    step1: isGerman ? 'Wir bereiten Ihre Bestellung für den Versand vor' : 'We prepare your order for shipping',
    step2: isGerman ? 'Sie erhalten eine Versandbenachrichtigung mit Tracking-Nummer' : 'You will receive a shipping notification with tracking number',
    step3: isGerman ? 'Ihre Möbel werden in 3-5 Werktagen geliefert' : 'Your furniture will be delivered in 3-5 business days',
    questions: isGerman ? 'Fragen?' : 'Questions?',
    contact: isGerman 
      ? 'Bei Fragen zu Ihrer Bestellung kontaktieren Sie uns gerne unter' 
      : 'If you have any questions about your order, please contact us at',
    footer: isGerman 
      ? 'Dies ist eine automatische E-Mail. Bitte antworten Sie nicht auf diese Nachricht.' 
      : 'This is an automated email. Please do not reply to this message.',
  };

  const shippingMethodText = {
    standard: isGerman ? 'Standard Versand (3-5 Werktage)' : 'Standard Shipping (3-5 business days)',
    express: isGerman ? 'Express Versand (1-2 Werktage)' : 'Express Shipping (1-2 business days)',
    pickup: isGerman ? 'Selbstabholung' : 'Self Pickup',
    assembly: isGerman ? 'Lieferung mit Montage' : 'Delivery with Assembly',
  }[data.shippingMethod] || data.shippingMethod;

  return `
<!DOCTYPE html>
<html lang="${data.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${translations.title}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #2D5016 0%, #4A7C2A 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .order-number {
      background-color: #f8f8f8;
      border-left: 4px solid #2D5016;
      padding: 15px;
      margin: 20px 0;
      font-weight: 600;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin: 30px 0 15px 0;
      color: #2D5016;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .items-table th {
      background-color: #f8f8f8;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #e0e0e0;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    .total-row {
      font-weight: 600;
      font-size: 18px;
      background-color: #f8f8f8;
    }
    .info-box {
      background-color: #f8f8f8;
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
    }
    .next-steps {
      background-color: #e8f5e9;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .next-steps ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .next-steps li {
      margin: 8px 0;
    }
    .footer {
      background-color: #f8f8f8;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .contact {
      margin: 20px 0;
      padding: 15px;
      background-color: #fff;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🪑 Möbelhaus</h1>
      <p style="margin: 10px 0 0 0; font-size: 18px;">${translations.title}</p>
    </div>
    
    <div class="content">
      <p class="greeting">${translations.greeting} ${data.customerName},</p>
      
      <p>${translations.thankYou}</p>
      
      <div class="order-number">
        ${translations.orderNumber}: <strong>${data.orderNumber}</strong>
      </div>
      
      <h2 class="section-title">${translations.orderDetails}</h2>
      
      <table class="items-table">
        <thead>
          <tr>
            <th>${translations.product}</th>
            <th>${translations.quantity}</th>
            <th>${translations.price}</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td>
                ${item.productName}
                ${item.variantColor ? `<br><small style="color: #666;">${item.variantColor}</small>` : ''}
              </td>
              <td>${item.quantity}</td>
              <td>€${(item.price / 100).toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="2">${translations.subtotal}</td>
            <td>€${(data.subtotal / 100).toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2">${translations.shipping}</td>
            <td>€${(data.shippingCost / 100).toFixed(2)}</td>
          </tr>
          <tr class="total-row">
            <td colspan="2">${translations.total}</td>
            <td>€${(data.total / 100).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      
      <h2 class="section-title">${translations.shippingAddress}</h2>
      <div class="info-box">
        ${data.shippingAddress.replace(/\n/g, '<br>')}
      </div>
      
      <h2 class="section-title">${translations.shippingMethod}</h2>
      <div class="info-box">
        ${shippingMethodText}
      </div>
      
      <div class="next-steps">
        <h3 style="margin-top: 0;">${translations.nextSteps}</h3>
        <ul>
          <li>✓ ${translations.step1}</li>
          <li>✓ ${translations.step2}</li>
          <li>✓ ${translations.step3}</li>
        </ul>
      </div>
      
      <div class="contact">
        <strong>${translations.questions}</strong><br>
        ${translations.contact}<br>
        📧 <a href="mailto:support@mobelhaus.at">support@mobelhaus.at</a><br>
        📞 +43 1 234 5678
      </div>
    </div>
    
    <div class="footer">
      <p>${translations.footer}</p>
      <p style="margin-top: 15px;">
        © 2026 Möbelhaus AT. Alle Rechte vorbehalten.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(data: OrderConfirmationData): Promise<boolean> {
  const isGerman = data.language === 'de';
  const subject = isGerman 
    ? `Bestellbestätigung - ${data.orderNumber}` 
    : `Order Confirmation - ${data.orderNumber}`;

  const html = generateOrderConfirmationEmail(data);

  return sendEmail({
    to: data.customerEmail,
    subject,
    html,
  });
}
