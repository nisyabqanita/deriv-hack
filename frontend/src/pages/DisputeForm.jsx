import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function DisputeForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    orderId: "",
    amount: "",
    country: "",
    dateOccurred: "",
    category: "",
    description: "",
    document: null,
  });

  const [fileName, setFileName] = useState("");
  const [submitStatus, setSubmitStatus] = useState({ message: "", isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, document: file });
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ message: "", isError: false });

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'document') {
        data.append('file', value);
      } else {
        data.append(key, value);
      }
    });

    try {
      const response = await fetch("http://localhost:5000/api/submit_dispute", {
        method: "POST",
        body: data,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to submit dispute");
      }

      setFormData({
        name: "",
        phone: "",
        orderId: "",
        amount: "",
        country: "",
        dateOccurred: "",
        category: "",
        description: "",
        document: null,
      });
      setFileName("");
      setSubmitStatus({
        message: "Dispute submitted successfully!",
        isError: false,
      });
    } catch (error) {
      setSubmitStatus({
        message: error.message || "An error occurred while submitting the dispute",
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#171D24] py-8 px-4">
      <div className="max-w-xl mx-auto bg-[#1E252D] rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-white">P2P Transfer Dispute Form</h2>
        
        {submitStatus.message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            submitStatus.isError ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
          }`}>
            {submitStatus.isError ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            <span>{submitStatus.message}</span>
          </div>
        )}

<form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Full Name</Label>
              <Input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Phone Number</Label>
              <Input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Order ID</Label>
              <Input 
                type="text" 
                name="orderId" 
                value={formData.orderId} 
                onChange={handleChange} 
                required 
                placeholder="ORD-123456"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Amount</Label>
              <Input 
                type="number" 
                name="amount" 
                value={formData.amount} 
                onChange={handleChange} 
                required 
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Country</Label>
              <Input 
                type="text" 
                name="country" 
                value={formData.country} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Date of Issue</Label>
              <Input 
                type="date" 
                name="dateOccurred" 
                value={formData.dateOccurred} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Dispute Category</Label>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="failed_transfer">Failed Transfer</option>
              <option value="wrong_amount">Wrong Amount</option>
              <option value="recipient_issue">Recipient Issue</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Description</Label>
            <Textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              placeholder="Please describe your issue..."
              className="h-32"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Supporting Document</Label>
            <Input 
              type="file" 
              accept=".jpg,.jpeg,.png,.pdf" 
              onChange={handleFileChange} 
              required 
            />
            {fileName && <p className="text-sm text-white mt-1">Selected: {fileName}</p>}
            <p className="mt-2 text-sm text-white">
              Accepted formats: JPG, JPEG, PNG, PDF (max. 10MB)
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-red-500 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Dispute"}
          </Button>
        </form>

      </div>
    </div>
  );
}