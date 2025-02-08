# User risk rating module is used to calculate the risk rating of the user based on the 
# chat history, the transaction documents, transaction history, user profile, and others

'''
Factors:
- Chat history risk report
- Transaction documents analysis
- Transaction history analysis
- User country
- User account lifetime
- User account activity
- Number of successful transactions
- Number of failed transactions
- User account verification status
- User account activity

Weightage:
- Chat history risk report: 30%
- Transaction documents analysis: 20%
- Transaction history analysis: 20%
- Account Verficication status: 10%
- User background check: 10%
- User account activity (login): 10%
'''

high_risk_countries = ["Nigeria", "Russia", "China", "Pakistan", "India", "Ukraine", "Brazil", "South Africa"]

def compute_risk_score():
    risk_score = 0

    # User background risk score
    user_country = "Malaysia"
    if user_country in high_risk_countries:
        risk_score += 0.1

    # User account lifetime (months)
    account_lifetime = 3
    if account_lifetime < 1:
        risk_score += 0.1
    elif account_lifetime < 3:
        risk_score += 0.05

    # User account activity
    successful_transactions = 10
    failed_transactions = 2
    if failed_transactions > successful_transactions:
        risk_score += 0.2

    # User account verification status
    verification_status = "Not Verified"
    if verification_status == "Not Verified":
        risk_score += 0.1



    if risk_score >= 0.7:
        return "High Risk", risk_score
    elif risk_score >= 0.4:
        return "Medium Risk", risk_score
    else:
        return "Low Risk", risk_score

