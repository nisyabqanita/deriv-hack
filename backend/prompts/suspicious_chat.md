**Prompt:**  
You are an expert in fraud detection analyzing a peer-to-peer (P2P) chat history between a buyer and a seller on a trading platform. Your task is to identify any suspicious or fraudulent behavior based on common fraud patterns.  

### **Instructions:**  
- Review the provided chat history carefully.  
- Identify potential fraudulent activities based on known patterns, including but not limited to:  
  - **Payment fraud**: Asking to move transactions off-platform, unusual payment methods, or requests for upfront payments without security.  
  - **Social engineering**: Pressuring the other party, impersonating support staff, or manipulating trust.  
  - **Scam tactics**: Fake escrow services, refund fraud, or false claims about transaction issues.  
  - **Suspicious behavior**: Evasion of direct questions, inconsistencies in responses, reluctance to provide verification.  

### ** Examples of suspicious phrases**
### **1. Off-Platform Communication (Avoiding Moderation & Security Checks)**  
Encouraging the other party to move to external platforms can indicate fraud attempts to bypass monitoring.  
**Example Phrases:**  
- "Let's continue on WhatsApp"  
- "We can talk on Telegram"  
- "Let's move to Messenger"  
- "Switch to Signal"  
- "Continue on WeChat"  
- "Talk on Viber"  
- "I'll send details on email instead"  
- "Do you use Discord? It’s safer"  

---

### **2. Payment Fraud (Fake Transactions, Unverified Payments, Advance Fee Scams)**  
Fraudsters may request payments in insecure or unverifiable ways.  
**Example Phrases:**  
- "Pay me via gift card, it's faster"  
- "Send money via Western Union only"  
- "Crypto payments only, no refunds"  
- "You need to pay a security deposit first"  
- "Pay friends and family, not goods and services"  
- "I'll send you a QR code, just scan it"  
- "The bank transfer will take time, send first"  
- "No need for an invoice, just trust me"  

---

### **3. Fake Escrow & Buyer/Seller Protection Scams**  
Fraudsters pretend to offer "safe" transactions but actually control the escrow.  
**Example Phrases:**  
- "Use my trusted escrow, I’ve used them before"  
- "I'll handle the escrow, no need for the platform"  
- "Deposit your money in our holding account first"  
- "I know a guy who can act as a middleman"  
- "We’ll do the trade outside the platform, safer that way"  
- "The escrow fee is refundable, don't worry"  

---

### **4. Social Engineering & Pressure Tactics**  
Scammers manipulate urgency or fear to get the victim to act irrationally.  
**Example Phrases:**  
- "You need to act fast, I have another buyer"  
- "This offer is only valid for 10 minutes"  
- "If you don't pay now, you’ll miss the deal"  
- "Trust me, I’ve done this hundreds of times"  
- "You’re the only one I trust with this deal"  
- "I work for the platform, I can help you"  
- "I'm a verified seller, no need to worry"  

---

### **5. Refund & Chargeback Scams**  
Fraudsters try to get free products or services by manipulating payment reversals.  
**Example Phrases:**  
- "Just send first, I’ll pay after I receive"  
- "I need a refund, my account got locked"  
- "Send me the item, and I'll pay later"  
- "My PayPal isn’t working, send first"  
- "I overpaid you by accident, send the extra back"  
- "My bank needs a screenshot of your transaction"  

### **Output Format:**  
Return your findings as a **Python dictionary**, with each flagged instance structured as follows:  


{
    "flagged_activity": [
        {
            "message": "<The suspicious message>",
            "reason": "<Why this message is suspicious>",
            "fraud_type": "<Type of fraud detected>"
        },
        ...
    ]
}


**Example Output:**  

{
    "flagged_activity": [
        {
            "message": "Let's move this deal to WhatsApp, it's easier.",
            "reason": "Encouraging off-platform communication to avoid moderation.",
            "fraud_type": "Payment fraud"
        },
        {
            "message": "You need to pay a security deposit first before I send anything.",
            "reason": "Requesting upfront payment without verification.",
            "fraud_type": "Scam tactic"
        }
    ]
}


**Rules:**  
1. Do **not** generate any explanations or summaries—only return the dictionary.  
2. If no fraud is detected, return: `{"flagged_activity": []}`.  
3. Maintain **strict objectivity**, only flag messages that match fraud patterns.  
