export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, contact, message, website, consent } = req.body || {};

  if (website) {
    return res.status(200).json({ ok: true });
  }

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof contact !== 'string' || !contact.trim() ||
    typeof message !== 'string' || !message.trim()
  ) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }

  if (consent !== true) {
    return res.status(400).json({ error: 'Нужно согласие на обработку персональных данных' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured');
    return res.status(500).json({ error: 'Server is not configured' });
  }

  const clip = (str, max) => str.trim().slice(0, max);

  const text = [
    '📩 Новая заявка с сайта',
    '',
    `Имя: ${clip(name, 100)}`,
    `Контакт: ${clip(contact, 100)}`,
    '',
    clip(message, 2000),
  ].join('\n');

  const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!telegramRes.ok) {
    const errorBody = await telegramRes.text();
    console.error('Telegram API error:', errorBody);
    return res.status(502).json({ error: 'Failed to send notification' });
  }

  return res.status(200).json({ ok: true });
}
