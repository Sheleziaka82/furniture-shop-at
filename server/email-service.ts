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

interface ShippingNotificationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery?: string;
  shippingMethod: string;
  language: 'de' | 'en';
}

/**
 * Generate tracking URL based on carrier
 */
export function generateTrackingUrl(carrier: string, trackingNumber: string): string {
  const carriers: Record<string, string> = {
    'DHL': `https://www.dhl.at/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${trackingNumber}`,
    'DPD': `https://tracking.dpd.de/parcelstatus?query=${trackingNumber}&locale=de_AT`,
    'Austrian Post': `https://www.post.at/sv/sendungsdetails?snr=${trackingNumber}`,
    'Post': `https://www.post.at/sv/sendungsdetails?snr=${trackingNumber}`,
    'GLS': `https://gls-group.eu/AT/de/paketverfolgung?match=${trackingNumber}`,
  };

  return carriers[carrier] || `https://www.google.com/search?q=${encodeURIComponent(carrier + ' tracking ' + trackingNumber)}`;
}

/**
 * Generate HTML email template for shipping notification
 */
export function generateShippingNotificationEmail(data: ShippingNotificationData): string {
  const isGerman = data.language === 'de';
  
  const translations = {
    title: isGerman ? 'Versandbestätigung' : 'Shipping Confirmation',
    greeting: isGerman ? 'Sehr geehrte/r' : 'Dear',
    shipped: isGerman 
      ? 'Gute Nachrichten! Ihre Bestellung wurde versandt und ist auf dem Weg zu Ihnen.' 
      : 'Good news! Your order has been shipped and is on its way to you.',
    orderNumber: isGerman ? 'Bestellnummer' : 'Order Number',
    trackingInfo: isGerman ? 'Sendungsverfolgung' : 'Tracking Information',
    trackingNumber: isGerman ? 'Sendungsnummer' : 'Tracking Number',
    carrier: isGerman ? 'Versanddienstleister' : 'Carrier',
    shippingMethod: isGerman ? 'Versandart' : 'Shipping Method',
    estimatedDelivery: isGerman ? 'Voraussichtliche Lieferung' : 'Estimated Delivery',
    trackButton: isGerman ? 'Sendung verfolgen' : 'Track Shipment',
    trackingTip: isGerman 
      ? 'Klicken Sie auf die Schaltfläche oben, um den aktuellen Status Ihrer Sendung zu verfolgen.' 
      : 'Click the button above to track the current status of your shipment.',
    deliveryInfo: isGerman ? 'Informationen zur Zustellung' : 'Delivery Information',
    deliveryTip1: isGerman 
      ? 'Bitte stellen Sie sicher, dass jemand zu Hause ist, um die Lieferung entgegenzunehmen' 
      : 'Please ensure someone is home to receive the delivery',
    deliveryTip2: isGerman 
      ? 'Bei Abwesenheit wird eine Benachrichtigung hinterlassen' 
      : 'A notification will be left if you are not available',
    deliveryTip3: isGerman 
      ? 'Große Möbelstücke werden bis zur Bordsteinkante geliefert' 
      : 'Large furniture items will be delivered to the curb',
    questions: isGerman ? 'Fragen?' : 'Questions?',
    contact: isGerman 
      ? 'Bei Fragen zur Lieferung kontaktieren Sie uns gerne unter' 
      : 'If you have any questions about delivery, please contact us at',
    footer: isGerman 
      ? 'Dies ist eine automatische E-Mail. Bitte antworten Sie nicht auf diese Nachricht.' 
      : 'This is an automated email. Please do not reply to this message.',
  };

  const shippingMethodText = {
    standard: isGerman ? 'Standard Versand' : 'Standard Shipping',
    express: isGerman ? 'Express Versand' : 'Express Shipping',
    pickup: isGerman ? 'Selbstabholung' : 'Self Pickup',
    assembly: isGerman ? 'Lieferung mit Montage' : 'Delivery with Assembly',
  }[data.shippingMethod] || data.shippingMethod;

  const trackingUrl = generateTrackingUrl(data.carrier, data.trackingNumber);

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
    .icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .highlight-box {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      border-left: 4px solid #2D5016;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .highlight-box h2 {
      margin: 0 0 10px 0;
      font-size: 20px;
      color: #2D5016;
    }
    .tracking-number {
      font-size: 24px;
      font-weight: 700;
      color: #2D5016;
      letter-spacing: 2px;
      margin: 10px 0;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 12px;
      margin: 20px 0;
    }
    .info-label {
      font-weight: 600;
      color: #666;
    }
    .info-value {
      color: #333;
    }
    .track-button {
      display: inline-block;
      background: linear-gradient(135deg, #2D5016 0%, #4A7C2A 100%);
      color: #ffffff;
      padding: 15px 40px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .track-button:hover {
      opacity: 0.9;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin: 30px 0 15px 0;
      color: #2D5016;
    }
    .tips-list {
      background-color: #f8f8f8;
      padding: 20px;
      border-radius: 8px;
      margin: 15px 0;
    }
    .tips-list ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .tips-list li {
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
      <div class="icon">📦</div>
      <h1>Möbelhaus</h1>
      <p style="margin: 10px 0 0 0; font-size: 18px;">${translations.title}</p>
    </div>
    
    <div class="content">
      <p class="greeting">${translations.greeting} ${data.customerName},</p>
      
      <p style="font-size: 16px;">${translations.shipped}</p>
      
      <div class="highlight-box">
        <h2>${translations.trackingInfo}</h2>
        <div class="tracking-number">${data.trackingNumber}</div>
      </div>
      
      <div style="text-align: center;">
        <a href="${trackingUrl}" class="track-button">
          🔍 ${translations.trackButton}
        </a>
      </div>
      
      <p style="text-align: center; color: #666; font-size: 14px;">
        ${translations.trackingTip}
      </p>
      
      <h2 class="section-title">${translations.orderNumber}</h2>
      <div style="background-color: #f8f8f8; padding: 15px; border-radius: 8px;">
        <strong>${data.orderNumber}</strong>
      </div>
      
      <div class="info-grid">
        <div class="info-label">${translations.carrier}:</div>
        <div class="info-value">${data.carrier}</div>
        
        <div class="info-label">${translations.shippingMethod}:</div>
        <div class="info-value">${shippingMethodText}</div>
        
        ${data.estimatedDelivery ? `
        <div class="info-label">${translations.estimatedDelivery}:</div>
        <div class="info-value">${data.estimatedDelivery}</div>
        ` : ''}
      </div>
      
      <h2 class="section-title">${translations.deliveryInfo}</h2>
      <div class="tips-list">
        <ul>
          <li>✓ ${translations.deliveryTip1}</li>
          <li>✓ ${translations.deliveryTip2}</li>
          <li>✓ ${translations.deliveryTip3}</li>
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
 * Send shipping notification email to customer
 */
export async function sendShippingNotificationEmail(data: ShippingNotificationData): Promise<boolean> {
  const isGerman = data.language === 'de';
  const subject = isGerman 
    ? `Ihre Bestellung wurde versandt - ${data.orderNumber}` 
    : `Your order has been shipped - ${data.orderNumber}`;

  const html = generateShippingNotificationEmail(data);

  return sendEmail({
    to: data.customerEmail,
    subject,
    html,
  });
}
