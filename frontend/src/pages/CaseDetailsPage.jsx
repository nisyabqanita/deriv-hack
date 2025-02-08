import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CaseDetailsPage = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dispute Case Details</h1>
        <Button className="bg-blue-500 text-white">Reopen</Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-4">
        {/* Case Summary */}
        <Card className="p-4 space-y-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Patterns detected</span>
            <span className="text-red-500 font-semibold">Country Risk High</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Transaction</span>
            <span>1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Funds total</span>
            <span>USD 5.25</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Status</span>
            <span className="text-green-500">Auto closed</span>
          </div>
        </Card>

        {/* Transactions Section */}
        <Card className="col-span-2">
          <CardContent className="space-y-6">
            <h2 className="text-lg font-semibold">Transactions</h2>
            <div className="p-4 border rounded-lg space-y-3">
              {/* Transaction Details */}
              <div className="flex justify-between">
                <span className="font-medium">USD 5.25</span>
                <span className="text-blue-500">Order ID #234875698235</span>
              </div>
              {/* Originator and Buyer */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Originator</p>
                  <p>Manuel Felipescupa</p>
                  
                </div>
                <div>
                  <p className="text-sm text-gray-500">Buyer</p>
                  <p>Nick's Diner</p>
                  <p className="text-sm text-gray-500">Country</p>
                  <p>USA</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Section */}
        <Card className="col-span-3">
          <CardContent className="space-y-4">
            <h2 className="text-lg font-semibold">Analysis</h2>
            <p className="bg-green-100 p-4 rounded-lg">
              The case was auto-closed with a certainty of 89.3% despite identified risk: "Country Risk High".
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-1/3 text-sm">Volume with this counterpart:</span>
                <div className="flex-1 bg-gray-200 rounded h-2">
                  <div className="bg-green-500 h-2 rounded" style={{ width: "89%" }}></div>
                </div>
                <span className="w-12 text-right text-sm">8.9</span>
              </div>
              <div className="flex items-center">
                <span className="w-1/3 text-sm">Cross border transactions:</span>
                <div className="flex-1 bg-gray-200 rounded h-2">
                  <div className="bg-green-500 h-2 rounded" style={{ width: "74%" }}></div>
                </div>
                <span className="w-12 text-right text-sm">7.4</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaseDetailsPage;
