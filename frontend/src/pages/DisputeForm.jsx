import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
  data.append("name", formData.name);
  data.append("phone", formData.phone);
  data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("orderId", formData.orderId);
    data.append("amount", formData.amount);
    data.append("country", formData.country);
    data.append("dateOccurred", formData.dateOccurred);

  data.append("file", formData.document); 

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
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4">P2P Transfer Dispute Form</h2>
      
      {submitStatus.message && (
        <div className={`mb-4 p-3 rounded ${
          submitStatus.isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div><Label>Name</Label><Input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
        <div><Label>Phone</Label><Input type="tel" name="phone" value={formData.phone} onChange={handleChange} required /></div>
        <div><Label>Order ID</Label><Input type="text" name="orderId" value={formData.orderId} onChange={handleChange} required /></div>
        <div><Label>Amount</Label><Input type="number" name="amount" value={formData.amount} onChange={handleChange} required /></div>
        <div><Label>Country</Label><Input type="text" name="country" value={formData.country} onChange={handleChange} required /></div>
        <div><Label>Date of Issue</Label><Input type="date" name="dateOccurred" value={formData.dateOccurred} onChange={handleChange} required /></div>
        <div>
          <Label>Dispute Category</Label>
          <Select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select a category</option>
            <option value="failed_transfer">Failed Transfer</option>
            <option value="wrong_amount">Wrong Amount</option>
            <option value="recipient_issue">Recipient Issue</option>
          </Select>
        </div>
        <div><Label>Description</Label><Textarea name="description" value={formData.description} onChange={handleChange} required /></div>
        <div>
          <Label>Upload Supporting Document</Label>
          <Input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} required />
          {fileName && <p className="text-sm mt-1">Selected File: {fileName}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Dispute"}</Button>
      </form>
    </div>
  );
}
