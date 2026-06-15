import React, { useState } from 'react';
import {
  Download,
  FileText,
  Search,
  Edit,
  Trash2,
  IndianRupee,
  Wallet,
  Activity,
  Undo2
} from 'lucide-react';

const AdminBilling=()=> {
  const [activeTab, setActiveTab] = useState('invoices');
  const [searchQuery, setSearchQuery] = useState('');

  // MOCK DATA (UI ONLY)
  const invoices = [
    {
      id: '1',
      invoiceNumber: 'INV-1001',
      customerName: 'John Doe',
      customerEmail: 'john@mail.com',
      amount: 12000,
      status: 'Paid',
      createdAt: new Date()
    },
    {
      id: '2',
      invoiceNumber: 'INV-1002',
      customerName: 'Alice Smith',
      customerEmail: 'alice@mail.com',
      amount: 8000,
      status: 'Pending',
      createdAt: new Date()
    }
  ];

  const payments = [
    {
      id: '1',
      paymentId: 'PAY-001',
      bookingId: 'BK-100',
      amount: 5000,
      gateway: 'Razorpay',
      paymentStatus: 'Paid',
      createdAt: new Date()
    },
    {
      id: '2',
      paymentId: 'PAY-002',
      bookingId: 'BK-101',
      amount: 3000,
      gateway: 'Stripe',
      paymentStatus: 'Pending',
      createdAt: new Date()
    }
  ];

  const stats = {
    totalRevenue: 50000,
    pendingPayments: 12000,
    refundRequests: 2,
    todaysCollections: 8000
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPayments = payments.filter(
    (pay) =>
      pay.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing & Payments</h1>
          <p className="text-white/50 text-sm">
            Manage invoices, payments, refunds and transactions.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-white/10 text-white rounded-lg">
            <Download className="w-4 h-4" /> Export
          </button>

          <button className="flex items-center gap-2 px-5 py-2 bg-[#C8A64D] text-[#071524] rounded-lg font-bold">
            <FileText className="w-4 h-4" /> Create Invoice
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-[#081A2F] p-5 rounded-xl border border-white/5">
          <div className="flex justify-between text-white/50 text-sm">
            Total Revenue <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <h2 className="text-white text-xl font-bold">₹{stats.totalRevenue}</h2>
        </div>

        <div className="bg-[#081A2F] p-5 rounded-xl border border-white/5">
          <div className="flex justify-between text-white/50 text-sm">
            Pending Payments <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <h2 className="text-white text-xl font-bold">₹{stats.pendingPayments}</h2>
        </div>

        <div className="bg-[#081A2F] p-5 rounded-xl border border-white/5">
          <div className="flex justify-between text-white/50 text-sm">
            Refund Requests <Undo2 className="w-4 h-4 text-red-400" />
          </div>
          <h2 className="text-white text-xl font-bold">{stats.refundRequests}</h2>
        </div>

        <div className="bg-[#081A2F] p-5 rounded-xl border border-white/5">
          <div className="flex justify-between text-white/50 text-sm">
            Today's Collections <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <h2 className="text-white text-xl font-bold">₹{stats.todaysCollections}</h2>
        </div>

      </div>

      {/* TABS + SEARCH */}
      <div className="bg-[#081A2F] rounded-xl border border-white/5">

        <div className="flex justify-between items-center p-4 border-b border-white/5">
          <div className="flex gap-6 text-sm font-bold uppercase">
            {['invoices', 'payments', 'refunds', 'transactions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={
                  activeTab === tab ? 'text-[#C8A64D]' : 'text-white/40'
                }
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
            <input
              className="bg-[#071524] border border-white/10 pl-9 pr-3 py-2 rounded text-sm text-white"
              placeholder={`Search ${activeTab}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4">

          {/* INVOICES */}
          {activeTab === 'invoices' && (
            <table className="w-full text-sm text-white/70">
              <thead className="text-white/40 text-xs uppercase">
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="border-t border-white/5">
                    <td>{inv.invoiceNumber}</td>
                    <td>{inv.customerName}</td>
                    <td>₹{inv.amount}</td>
                    <td>{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* PAYMENTS */}
          {activeTab === 'payments' && (
            <table className="w-full text-sm text-white/70">
              <thead className="text-white/40 text-xs uppercase">
                <tr>
                  <th>Payment ID</th>
                  <th>Booking ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="border-t border-white/5">
                    <td>{pay.paymentId}</td>
                    <td>{pay.bookingId}</td>
                    <td>₹{pay.amount}</td>
                    <td>{pay.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* PLACEHOLDERS */}
          {activeTab === 'refunds' && (
            <div className="p-10 text-center text-white/40">
              Refunds UI Coming Soon
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="p-10 text-center text-white/40">
              Transactions UI Coming Soon
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
export default AdminBilling;