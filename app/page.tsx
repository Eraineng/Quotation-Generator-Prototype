"use client";

import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Plus, Printer, Trash2 } from "lucide-react";

const packageCatalog = [
  {
    id: "email-support-small",
    name: "Email Support",
    usersLabel: "Small Team (1-10 users)",
    volumeLabel: "Low Volume (<10,000 emails/month)",
    pricePerUser: 20,
    recommendedUsers: 10,
    uom: "Months",
  },
  {
    id: "email-support-medium",
    name: "Email Support",
    usersLabel: "Growing Team (11-25 users)",
    volumeLabel: "Medium Volume (<25,000 emails/month)",
    pricePerUser: 18,
    recommendedUsers: 20,
    uom: "Months",
  },
  {
    id: "server-support",
    name: "Server Support",
    usersLabel: "1 Dedicated Server",
    volumeLabel: "Monitoring + patch support",
    pricePerUser: 450,
    recommendedUsers: 1,
    uom: "Months",
  },
];

const defaultNotes = [
  "All prices listed are per user, per month. Pricing is exclusive of applicable taxes, which will be calculated and applied at checkout.",
  "Subscriptions are available on a 3-month, 6-month, or 12-month cycle.",
  "Full payment for the chosen subscription cycle is required upfront.",
  "Standard support is included with all subscription plans.",
  "No refunds will be provided for cancellations made during an active subscription cycle.",
  "Services will remain active until the end of the current subscription period.",
  "We reserve the right to modify or update the features and pricing of our plans at any time.",
];

function currency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}

type QuoteItem = {
  id: string;
  packageId: string;
  duration: number;
  customUsers?: number;
};

export default function QuotationGeneratorPrototype() {
  const printRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    quotationBy: "Micera Solutions",
    contactName: "Benjamin Au Yong",
    companyName: "Goldken Sdn Bhd",
    address1: "9, Jln. 18/17, tmn. Kanagapuram",
    address2: "off Jln. Klang Lama",
    address3: "Petaling Jaya, Selangor, Malaysia",
    documentNo: "Q2025010701",
    invoiceNo: "INV2025010701",
    invoiceDate: "2025-01-07",
    dueDate: "2025-01-14",
    notes: defaultNotes.join("\n"),
  });

  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: crypto.randomUUID(),
      packageId: "email-support-small",
      duration: 6,
      customUsers: 10,
    },
  ]);

  const computedItems = useMemo(() => {
    return items.map((item, index) => {
      const selected = packageCatalog.find((pkg) => pkg.id === item.packageId) ?? packageCatalog[0];
      const users = item.customUsers || selected.recommendedUsers;
      const monthlyPrice = selected.pricePerUser * users;
      const total = monthlyPrice * item.duration;

      return {
        index: index + 1,
        id: item.id,
        packageName: selected.name,
        usersLabel: selected.usersLabel,
        volumeLabel: selected.volumeLabel,
        duration: item.duration,
        uom: selected.uom,
        unitPrice: monthlyPrice,
        total,
        descriptionLines: [
          selected.usersLabel,
          selected.volumeLabel,
          `Price: ${currency(selected.pricePerUser)} per user per month`,
          `For ${users} users: ${currency(monthlyPrice)} per month`,
        ],
      };
    });
  }, [items]);

  const grandTotal = useMemo(
    () => computedItems.reduce((sum, item) => sum + item.total, 0),
    [computedItems]
  );

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        packageId: packageCatalog[0].id,
        duration: 6,
        customUsers: packageCatalog[0].recommendedUsers,
      },
    ]);
  };

  const updateItem = (id: string, patch: Partial<QuoteItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:bg-white print:p-0">
      <style>{`
        @page {
          size: A4 portrait;
          margin: 10mm;
        }
        @media print {
          .no-print { display: none !important; }
          .print-shell {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            width: 100% !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>

      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[420px_1fr]">
        <Card className="no-print rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5" />
              Quotation Form
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Quotation By</Label>
                <Input
                  value={form.quotationBy}
                  onChange={(e) => setForm({ ...form, quotationBy: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Name</Label>
                <Input
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Company Name</Label>
                <Input
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address Line 1</Label>
                <Input
                  value={form.address1}
                  onChange={(e) => setForm({ ...form, address1: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address Line 2</Label>
                <Input
                  value={form.address2}
                  onChange={(e) => setForm({ ...form, address2: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address Line 3</Label>
                <Input
                  value={form.address3}
                  onChange={(e) => setForm({ ...form, address3: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Document No</Label>
                <Input
                  value={form.documentNo}
                  onChange={(e) => setForm({ ...form, documentNo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Invoice No</Label>
                <Input
                  value={form.invoiceNo}
                  onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Invoice Date</Label>
                <Input
                  type="date"
                  value={form.invoiceDate}
                  onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Packages</h3>
                <Button type="button" variant="outline" onClick={addItem} className="gap-2">
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </div>

              {items.map((item, idx) => {
                const selected = packageCatalog.find((pkg) => pkg.id === item.packageId) ?? packageCatalog[0];
                return (
                  <div key={item.id} className="space-y-3 rounded-2xl border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Item {idx + 1}</div>
                      {items.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Package</Label>
                      <Select value={item.packageId} onValueChange={(value) => updateItem(item.id, { packageId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select package" />
                        </SelectTrigger>
                        <SelectContent>
                          {packageCatalog.map((pkg) => (
                            <SelectItem key={pkg.id} value={pkg.id}>
                              {pkg.name} — {pkg.usersLabel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Users / Quantity</Label>
                        <Input
                          type="number"
                          min={1}
                          value={item.customUsers ?? selected.recommendedUsers}
                          onChange={(e) => updateItem(item.id, { customUsers: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Select
                          value={String(item.duration)}
                          onValueChange={(value) => updateItem(item.id, { duration: Number(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 Months</SelectItem>
                            <SelectItem value="6">6 Months</SelectItem>
                            <SelectItem value="12">12 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <Label>Terms & Notes</Label>
              <Textarea
                rows={8}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <p className="text-xs text-slate-500">One bullet line per row. Keep it short for single-page PDF export.</p>
            </div>

            <Button onClick={handlePrint} className="w-full gap-2 rounded-xl">
              <Printer className="h-4 w-4" /> Export / Print PDF
            </Button>
          </CardContent>
        </Card>

        <div ref={printRef} className="print-shell mx-auto w-full max-w-[900px] rounded-2xl border bg-white shadow-xl print:max-w-none">
          <div className="min-h-[1122px] p-8 text-slate-800">
            <div className="mb-8 grid grid-cols-2 items-start gap-6">
              <div>
                <div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-violet-500 to-blue-700 text-2xl font-bold text-white">
                  M
                </div>
                <div className="text-4xl font-black tracking-wide">MICERA</div>
                <div className="text-sm font-semibold tracking-[0.2em] text-slate-600">SOLUTIONS</div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-semibold tracking-tight">Quotation</div>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_1.4fr_1fr] gap-8 text-[15px]">
              <div>
                <div className="mb-2 font-bold">Quotation By</div>
                <div>{form.quotationBy}</div>
              </div>

              <div>
                <div className="mb-2 font-bold">Quotation To</div>
                <div>{form.contactName}</div>
                <div>{form.companyName}</div>
                <div>{form.address1}</div>
                <div>{form.address2}</div>
                <div>{form.address3}</div>
              </div>

              <div className="justify-self-end text-right">
                <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-2 whitespace-nowrap">
                  <div className="font-bold">Document No:</div>
                  <div>{form.documentNo}</div>
                  <div className="font-bold">Invoice No:</div>
                  <div>{form.invoiceNo}</div>
                  <div className="font-bold">Invoice Date:</div>
                  <div>{new Date(form.invoiceDate).toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" })}</div>
                  <div className="font-bold">Due Date:</div>
                  <div>{new Date(form.dueDate).toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" })}</div>
                </div>
              </div>
            </div>

            <div className="mt-10 overflow-hidden rounded-xl border border-slate-300">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-emerald-700 text-white">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold">Package</th>
                    <th className="px-3 py-3 text-left font-semibold">Description</th>
                    <th className="px-3 py-3 text-center font-semibold">Unit/Man Day</th>
                    <th className="px-3 py-3 text-center font-semibold">UOM</th>
                    <th className="px-3 py-3 text-right font-semibold">Unit Price (MYR)</th>
                    <th className="px-3 py-3 text-right font-semibold">Total (MYR)</th>
                  </tr>
                </thead>
                <tbody>
                  {computedItems.map((item) => (
                    <tr key={item.id} className="align-top border-b border-slate-200">
                      <td className="px-3 py-3">
                        <div>{item.index}</div>
                        <div className="font-medium">{item.packageName}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="space-y-1">
                          {item.descriptionLines.map((line) => (
                            <div key={line}>{line}</div>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">{item.duration}</td>
                      <td className="px-3 py-3 text-center">{item.uom}</td>
                      <td className="px-3 py-3 text-right">{currency(item.unitPrice)}</td>
                      <td className="px-3 py-3 text-right">{currency(item.total)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={5} className="px-3 py-3 text-right text-xl font-bold">
                      Total
                    </td>
                    <td className="px-3 py-3 text-right text-xl font-bold">{currency(grandTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 space-y-2 text-[13px] leading-relaxed">
              {form.notes
                .split("\n")
                .filter(Boolean)
                .map((line, idx) => (
                  <div key={idx}>*{line}</div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
