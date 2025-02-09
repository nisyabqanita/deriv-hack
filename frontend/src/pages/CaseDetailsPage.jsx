import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, FileText, User, Phone, Globe, Calendar, AlertTriangle, DollarSign } from "lucide-react";

const CaseDetailsPage = () => {
  const caseDetails = {
    name: "Aiden Davis",
    phone: "+1-415-555-1234",
    orderId: "456789234510",
    amount: "USD 2,799.99",
    country: "USA",
    dateOccurred: "2025-02-03",
    category: "Non-receipt of goods",
    description: "Buyer claims they did not receive the ordered items despite the seller has sent the items.'",
    document: "shipping_dispute_report.pdf",
    buyerName: "Emily Clark",
    buyerPhone: "+44-20-7946-0958",
    buyerCountry: "United Kingdom",
    transactionMethod: "Credit Card (Visa)",
    paymentStatus: "Completed",
    refundStatus: "Requested",
    merchantResponse: "Seller confirmed shipment, and item was successfully sent. No further issues on their side.",
    sellerName: "Aiden Davis",
    sellerPhone: "+49-171-2345678",
    sellerCountry: "Africa",
    tradingRate: "1 USD = 0.94 EUR",
    disputeResolutionTime: "2025-02-05",
    technicalDetails: {
      ipAddress: "192.168.1.1",
      device: "iPhone 13 Pro, iOS 15.4",
      location: "London, UK",
    },
    aiAnalysis: {
      disputeScore: "9.2/10",
      scamProbability: "73%",
      fraudDetection: "30%",
      recommendation: "Refund Buyer"
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Dispute Case #{caseDetails.orderId}</h1>
          <p className="text-gray-600 text-lg">Created on {caseDetails.dateOccurred}</p>
          <p className="text-gray-600 text-lg">Dispute raised by {caseDetails.name}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-yellow-500">
            <AlertCircle />
            <span className="font-medium text-sm">AI Analysis Completed</span>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition duration-300">Make Decision</Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Case Information */}
        <Card className="col-span-8 shadow-lg border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dispute Case Overview</h2>
          <CardContent className="space-y-8">
            {/* Customer and Seller Information */}
            <div className="grid grid-cols-2 gap-8 p-6 bg-gray-50 rounded-lg">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <User className="text-gray-500 w-6 h-6" />
                  <div>
                    <p className="text-sm text-gray-600">Buyer Name</p>
                    <p className="font-semibold text-lg">{caseDetails.buyerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="text-gray-500 w-6 h-6" />
                  <div>
                    <p className="text-sm text-gray-600">Buyer Phone Number</p>
                    <p className="font-semibold text-lg">{caseDetails.buyerPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Globe className="text-gray-500 w-6 h-6" />
                  <div>
                    <p className="text-sm text-gray-600">Buyer Country</p>
                    <p className="font-semibold text-lg">{caseDetails.buyerCountry}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <User className="text-gray-500 w-6 h-6" />
                  <div>
                    <p className="text-sm text-gray-600">Seller Name</p>
                    <p className="font-semibold text-lg">{caseDetails.sellerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="text-gray-500 w-6 h-6" />
                  <div>
                    <p className="text-sm text-gray-600">Seller Phone Number</p>
                    <p className="font-semibold text-lg">{caseDetails.sellerPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Globe className="text-gray-500 w-6 h-6" />
                  <div>
                    <p className="text-sm text-gray-600">Seller Country</p>
                    <p className="font-semibold text-lg">{caseDetails.sellerCountry}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Payment Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{caseDetails.amount}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Dispute Category</p>
                  <p className="text-2xl font-bold text-gray-900">{caseDetails.category}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Transaction Method</p>
                  <p className="text-2xl font-bold text-gray-900">{caseDetails.transactionMethod}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="text-2xl font-bold text-gray-900">{caseDetails.paymentStatus}</p>
                </div>
              </div>
            </div>

            {/* Trading Rate */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Trading Rate</h3>
              <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600">Seller's Trading Rate (1 USD)</p>
                <p className="text-2xl font-bold text-gray-900">{caseDetails.tradingRate}</p>
              </div>
            </div>

            {/* Description */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Dispute Description</h3>
              <p className="p-6 bg-gray-50 rounded-lg shadow-sm text-gray-700">{caseDetails.description}</p>
            </div>

            {/* Seller Response */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Seller Response</h3>
              <p className="p-6 bg-gray-50 rounded-lg shadow-sm text-gray-700">{caseDetails.merchantResponse}</p>
            </div>

            {/* Dispute Resolution Time and Technical Details */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Dispute Estimate Resolution Time</h3>
              <p className="p-6 bg-gray-50 rounded-lg shadow-sm text-gray-700">{caseDetails.disputeResolutionTime}</p>

              <h3 className="text-xl font-semibold text-gray-800 mb-6">Technical Details</h3>
              <div className="p-6 bg-gray-50 rounded-lg shadow-sm space-y-4">
                <div>
                  <p className="text-sm text-gray-600">IP Address</p>
                  <p className="font-semibold text-lg">{caseDetails.technicalDetails.ipAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Device</p>
                  <p className="font-semibold text-lg">{caseDetails.technicalDetails.device}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-lg">{caseDetails.technicalDetails.location}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Analysis Sidebar */}
        <div className="col-span-4 space-y-8">
          {/* Risk Score Card */}
          <Card className="shadow-lg border rounded-lg p-6">
            <div className="flex items-center justify-between text-xl font-semibold text-gray-800">
              <span>Risk Analysis</span>
              <AlertTriangle className="text-red-500 w-6 h-6" />
            </div>
            <CardContent className="space-y-6">
              <div className="p-6 bg-red-50 rounded-lg flex items-center gap-4">
                <AlertCircle className="text-red-500 w-6 h-6" />
                <span className="text-red-700 font-medium">High Country Risk Detected</span>
              </div>

              {/* AI Confidence */}
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-4">AI Analysis Metrics</h4>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Dispute Score</span>
                      <span className="font-semibold">9.2/10</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Scam Probability</span>
                      <span className="font-semibold">73%</span>
                    </div>
                    
                  </div>
                  {/* Add additional AI metrics as needed */}
                  <div>
                    
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-orange-500 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Fraud Detection</span>
                      <span className="font-semibold">30%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-red-500 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>AI Analysis Result</span>
                      <p className="text-2xl font-bold text-gray-900">{caseDetails.aiAnalysis.recommendation}</p>
                    </div>
                    
                  </div>
                </div>
              </div>

              {/* Document and File */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-blue-600">
                  <FileText className="w-6 h-6" />
                  <span>View Dispute Attachement</span>
                </div>
                <div>
                  <Button className="bg-gray-700 text-white px-4 py-2 rounded-lg">Download</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

       
      </div>
    </div>
  );
};

export default CaseDetailsPage;
