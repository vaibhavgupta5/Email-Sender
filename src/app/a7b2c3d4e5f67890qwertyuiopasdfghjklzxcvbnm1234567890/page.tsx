'use client'; 
import { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const Home = () => {
  const [emailList, setEmailList] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (data) {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]]; 
        const emails: string[] = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 })
          .map((row: string[]) => row[0]) 
          .filter((email: string) => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)); 

        setEmailList(emails.join(', ')); 
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setStatus(''); 

    if (!emailList || !subject || !message) {
      setStatus('Please fill in all fields.'); 
      return;
    }

    try {
      const res = await axios.post('/api/sendBulkEmail', {
        emailList,
        subject,
        message,
      });

      if (res.status === 200) {
        setStatus('Emails sent successfully!'); 
        setEmailList('');
        setSubject('');
        setMessage('');
      } else {
        setStatus('Error sending emails.'); 
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to send emails';
      setStatus(`Error: ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Send Bulk Emails</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email List (comma separated):</label>
            <input
              type="text"
              className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
              required
              placeholder="example1@mail.com, example2@mail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Excel Sheet:</label>
            <input
              type="file"
              accept=".xlsx, .xls"
              className="w-full text-sm"
              onChange={handleFileUpload}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
            <input
              type="text"
              className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Email Subject"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
            <textarea
              className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Your message here"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Send Emails
          </button>
        </form>
        {status && <p className="text-center mt-4 text-sm font-medium text-red-600">{status}</p>}
      </div>
    </div>
  );
};

export default Home;
