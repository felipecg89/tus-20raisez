<<<<<<< HEAD
# HubSpot Integration Guide

## Overview
This document describes the HubSpot integration implemented in Tus Raíces MX. HubSpot provides CRM, email marketing, chat, and analytics capabilities.

## Integrated Features

### ✅ 1. **Analytics & Tracking**
- **Automatic page view tracking** - All pages are tracked
- **Custom event tracking** - Form submissions and user interactions
- **User identification** - Identify users by email

### ✅ 2. **Contact Management (CRM)**
- **Form submissions** - Contacts created automatically from ContactForm
- **Contact properties** - Email, phone, name, city, lifecycle stage
- **Lead scoring** - Contacts marked as leads automatically

### ✅ 3. **Chat Widget**
- **Live chat** - Configured through HubSpot portal
- **Chatbot** - Can be configured in HubSpot settings
- **Automatic initialization** - Widget loads on all pages

### ✅ 4. **Email Marketing (Ready)**
- Infrastructure in place to send emails via HubSpot API
- Forms can trigger automated workflows

## Configuration

### Portal Information
- **Portal ID**: 50787765
- **API Key**: Configured in `client/lib/hubspotService.ts`

### Files Modified/Created

```
client/lib/hubspotService.ts          - Core HubSpot service
client/hooks/useHubSpot.ts            - React hooks for HubSpot
client/components/home/ContactForm.tsx - Updated to sync with HubSpot
index.html                            - Added tracking script
```

## Usage Examples

### 1. Track Custom Event
```typescript
import { trackEvent } from "@/lib/hubspotService";

// In any component
trackEvent("Button_Clicked", {
  button_name: "Request_Quote",
  timestamp: new Date().toISOString()
});
```

### 2. Identify User
```typescript
import { identifyUser } from "@/lib/hubspotService";

// When user logs in or provides email
identifyUser("user@example.com", {
  firstname: "Juan",
  lastname: "Pérez"
});
```

### 3. Create/Update Contact
```typescript
import { createOrUpdateContact } from "@/lib/hubspotService";

await createOrUpdateContact({
  firstname: "Juan",
  lastname: "Pérez",
  email: "juan@example.com",
  phone: "+1234567890",
  city: "Mexico City",
  hs_lead_status: "NEW",
  lifecyclestage: "lead"
});
```

### 4. Submit Form to HubSpot
```typescript
import { submitHubSpotForm } from "@/lib/hubspotService";

const result = await submitHubSpotForm({
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "+1234567890",
  city: "Mexico City"
});
```

## HubSpot Dashboard Setup

### Configure Live Chat
1. Go to **HubSpot Dashboard** → **Conversations** → **Live Chat**
2. Click **Create chatflow**
3. Customize chat messages, triggers, and routing
4. The chat widget will appear automatically on all pages

### Configure Email Workflows
1. Go to **HubSpot Dashboard** → **Automation** → **Workflows**
2. Create new workflow triggered by:
   - **Contact created** - New lead acquired
   - **Contact property changed** - When status updates
3. Add email sequences and follow-up actions

### Monitor Analytics
1. Go to **HubSpot Dashboard** → **Reports**
2. View:
   - **Contacts by source** - Track which pages generate leads
   - **Conversion funnel** - Track from visitor to customer
   - **Form submissions** - Monitor contact form activity

## Important Notes

⚠️ **API Key Security**
- The API key is currently in client code (development only)
- For production, move API operations to backend server in `server/routes/`
- Implement endpoint like `POST /api/hubspot/contacts` for secure submission

### Recommended Production Setup

```typescript
// client/lib/hubspotService.ts - Remove API key, call backend instead
export const submitHubSpotForm = async (formData) => {
  const response = await fetch("/api/hubspot/contacts", {
    method: "POST",
    body: JSON.stringify(formData)
  });
  return response.json();
};
```

```typescript
// server/routes/hubspot.ts - Backend endpoint
import { Router } from "express";

const router = Router();

router.post("/contacts", async (req, res) => {
  const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ properties: req.body })
  });
  
  const data = await response.json();
  res.json(data);
});

export default router;
```

## Testing

### Test Contact Creation
1. Fill out ContactForm on homepage
2. Go to HubSpot Dashboard → **Contacts**
3. Verify new contact appears with correct information

### Test Event Tracking
1. Open browser DevTools → **Network** tab
2. Look for requests to `js.hs-scripts.com`
3. Custom events should show in HubSpot analytics

### Test Chat Widget
1. Open website in browser
2. Look for chat widget in bottom-right corner
3. Click and verify chat opens

## Troubleshooting

### Chat Widget Not Appearing
- **Solution 1**: Reload page and wait 5 seconds
- **Solution 2**: Check HubSpot settings → ensure Live Chat is enabled
- **Solution 3**: Check browser console for errors

### Contacts Not Syncing
- **Solution 1**: Verify API key is correct
- **Solution 2**: Check HubSpot API rate limits (100 req/10 sec)
- **Solution 3**: Review form validation - ensure email is included

### Analytics Not Tracking
- **Solution 1**: Check if HubSpot script loaded in page source
- **Solution 2**: Clear browser cache and reload
- **Solution 3**: Verify Portal ID is correct in HTML

## Next Steps

1. **Test the integration** - Submit test form and verify in HubSpot
2. **Configure workflows** - Set up automated email follow-ups
3. **Customize chat** - Add custom messages and routing
4. **Move to production** - Secure API key in backend environment variables
5. **Monitor analytics** - Track conversions and optimize

## Resources

- [HubSpot API Documentation](https://developers.hubapi.com/)
- [HubSpot Chat Setup](https://knowledge.hubspot.com/articles/kcs_article/conversations/set-up-live-chat)
- [HubSpot Workflows](https://knowledge.hubspot.com/articles/kcs_article/workflows/create-workflow)
=======
# HubSpot Integration Guide

## Overview
This document describes the HubSpot integration implemented in Tus Raíces MX. HubSpot provides CRM, email marketing, chat, and analytics capabilities.

## Integrated Features

### ✅ 1. **Analytics & Tracking**
- **Automatic page view tracking** - All pages are tracked
- **Custom event tracking** - Form submissions and user interactions
- **User identification** - Identify users by email

### ✅ 2. **Contact Management (CRM)**
- **Form submissions** - Contacts created automatically from ContactForm
- **Contact properties** - Email, phone, name, city, lifecycle stage
- **Lead scoring** - Contacts marked as leads automatically

### ✅ 3. **Chat Widget**
- **Live chat** - Configured through HubSpot portal
- **Chatbot** - Can be configured in HubSpot settings
- **Automatic initialization** - Widget loads on all pages

### ✅ 4. **Email Marketing (Ready)**
- Infrastructure in place to send emails via HubSpot API
- Forms can trigger automated workflows

## Configuration

### Portal Information
- **Portal ID**: 50787765
- **API Key**: Configured in `client/lib/hubspotService.ts`

### Files Modified/Created

```
client/lib/hubspotService.ts          - Core HubSpot service
client/hooks/useHubSpot.ts            - React hooks for HubSpot
client/components/home/ContactForm.tsx - Updated to sync with HubSpot
index.html                            - Added tracking script
```

## Usage Examples

### 1. Track Custom Event
```typescript
import { trackEvent } from "@/lib/hubspotService";

// In any component
trackEvent("Button_Clicked", {
  button_name: "Request_Quote",
  timestamp: new Date().toISOString()
});
```

### 2. Identify User
```typescript
import { identifyUser } from "@/lib/hubspotService";

// When user logs in or provides email
identifyUser("user@example.com", {
  firstname: "Juan",
  lastname: "Pérez"
});
```

### 3. Create/Update Contact
```typescript
import { createOrUpdateContact } from "@/lib/hubspotService";

await createOrUpdateContact({
  firstname: "Juan",
  lastname: "Pérez",
  email: "juan@example.com",
  phone: "+1234567890",
  city: "Mexico City",
  hs_lead_status: "NEW",
  lifecyclestage: "lead"
});
```

### 4. Submit Form to HubSpot
```typescript
import { submitHubSpotForm } from "@/lib/hubspotService";

const result = await submitHubSpotForm({
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "+1234567890",
  city: "Mexico City"
});
```

## HubSpot Dashboard Setup

### Configure Live Chat
1. Go to **HubSpot Dashboard** → **Conversations** → **Live Chat**
2. Click **Create chatflow**
3. Customize chat messages, triggers, and routing
4. The chat widget will appear automatically on all pages

### Configure Email Workflows
1. Go to **HubSpot Dashboard** → **Automation** → **Workflows**
2. Create new workflow triggered by:
   - **Contact created** - New lead acquired
   - **Contact property changed** - When status updates
3. Add email sequences and follow-up actions

### Monitor Analytics
1. Go to **HubSpot Dashboard** → **Reports**
2. View:
   - **Contacts by source** - Track which pages generate leads
   - **Conversion funnel** - Track from visitor to customer
   - **Form submissions** - Monitor contact form activity

## Important Notes

⚠️ **API Key Security**
- The API key is currently in client code (development only)
- For production, move API operations to backend server in `server/routes/`
- Implement endpoint like `POST /api/hubspot/contacts` for secure submission

### Recommended Production Setup

```typescript
// client/lib/hubspotService.ts - Remove API key, call backend instead
export const submitHubSpotForm = async (formData) => {
  const response = await fetch("/api/hubspot/contacts", {
    method: "POST",
    body: JSON.stringify(formData)
  });
  return response.json();
};
```

```typescript
// server/routes/hubspot.ts - Backend endpoint
import { Router } from "express";

const router = Router();

router.post("/contacts", async (req, res) => {
  const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ properties: req.body })
  });
  
  const data = await response.json();
  res.json(data);
});

export default router;
```

## Testing

### Test Contact Creation
1. Fill out ContactForm on homepage
2. Go to HubSpot Dashboard → **Contacts**
3. Verify new contact appears with correct information

### Test Event Tracking
1. Open browser DevTools → **Network** tab
2. Look for requests to `js.hs-scripts.com`
3. Custom events should show in HubSpot analytics

### Test Chat Widget
1. Open website in browser
2. Look for chat widget in bottom-right corner
3. Click and verify chat opens

## Troubleshooting

### Chat Widget Not Appearing
- **Solution 1**: Reload page and wait 5 seconds
- **Solution 2**: Check HubSpot settings → ensure Live Chat is enabled
- **Solution 3**: Check browser console for errors

### Contacts Not Syncing
- **Solution 1**: Verify API key is correct
- **Solution 2**: Check HubSpot API rate limits (100 req/10 sec)
- **Solution 3**: Review form validation - ensure email is included

### Analytics Not Tracking
- **Solution 1**: Check if HubSpot script loaded in page source
- **Solution 2**: Clear browser cache and reload
- **Solution 3**: Verify Portal ID is correct in HTML

## Next Steps

1. **Test the integration** - Submit test form and verify in HubSpot
2. **Configure workflows** - Set up automated email follow-ups
3. **Customize chat** - Add custom messages and routing
4. **Move to production** - Secure API key in backend environment variables
5. **Monitor analytics** - Track conversions and optimize

## Resources

- [HubSpot API Documentation](https://developers.hubapi.com/)
- [HubSpot Chat Setup](https://knowledge.hubspot.com/articles/kcs_article/conversations/set-up-live-chat)
- [HubSpot Workflows](https://knowledge.hubspot.com/articles/kcs_article/workflows/create-workflow)
>>>>>>> 5d4ecee69de27c68db3eabc663ba48a32a5c7829
