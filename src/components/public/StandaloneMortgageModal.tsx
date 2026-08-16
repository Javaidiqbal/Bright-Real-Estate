import React, { useState } from 'react';
import { X, Calculator, Coins, Percent, Calendar, Shield, Sparkles } from 'lucide-react';
import { formatPKR } from '../../utils/formatters';

interface StandaloneMortgageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneMortgageModal: React.FC<StandaloneMortgageModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [homePrice, setHomePrice] = useState(4500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState(0.9); // 0.9% SF average
  const [monthlyHoa, setMonthlyHoa] = useState(400);

  if (!isOpen) return null;

  const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
  const loanAmount = Math.max(0, homePrice - downPaymentAmount);
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  
  const monthlyPrincipalAndInterest = monthlyRate > 0 && loanAmount > 0
    ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    : 0;

  const monthlyPropertyTax = (homePrice * (propertyTaxRate / 100)) / 12;
  const monthlyHomeInsurance = (homePrice * 0.0035) / 12;
  const totalMonthlyPayment = Math.round(monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyHoa);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold font-serif">Luxury Mortgage & Payment Estimator</h2>
              <p className="text-[11px] text-slate-400">Calculate monthly financial requirements and debt service</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Result Card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-850 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Estimated Total Monthly Outlay</span>
              <span className="text-3xl sm:text-4xl font-bold font-serif text-amber-400">
                {formatPKR(totalMonthlyPayment)}
                <span className="text-xs font-sans text-slate-300 font-normal"> / mo</span>
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-0.5 sm:text-right">
              <div>Total Loan: <strong>{formatPKR(loanAmount)}</strong></div>
              <div>Down Payment: <strong>{formatPKR(downPaymentAmount)} ({downPaymentPercent}%)</strong></div>
            </div>
          </div>

          {/* Breakdown bar */}
          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
              <div 
                style={{ width: `${(monthlyPrincipalAndInterest / totalMonthlyPayment) * 100}%` }} 
                className="bg-amber-500 h-full" 
                title="Principal & Interest" 
              />
              <div 
                style={{ width: `${(monthlyPropertyTax / totalMonthlyPayment) * 100}%` }} 
                className="bg-sky-500 h-full" 
                title="Property Taxes" 
              />
              <div 
                style={{ width: `${(monthlyHomeInsurance / totalMonthlyPayment) * 100}%` }} 
                className="bg-emerald-500 h-full" 
                title="Home Insurance" 
              />
              {monthlyHoa > 0 && (
                <div 
                  style={{ width: `${(monthlyHoa / totalMonthlyPayment) * 100}%` }} 
                  className="bg-purple-500 h-full" 
                  title="HOA Fees" 
                />
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-semibold">
              <div className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>P&I: {formatPKR(monthlyPrincipalAndInterest)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                <span>Tax: {formatPKR(monthlyPropertyTax)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Insurance: {formatPKR(monthlyHomeInsurance)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span>HOA: {formatPKR(monthlyHoa)}</span>
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Property Price (PKR)
              </label>
              <input
                type="number"
                step={50000}
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Down Payment ({downPaymentPercent}%)
              </label>
              <input
                type="range"
                min={10}
                max={70}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer mt-3"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mortgage Interest Rate (%)
              </label>
              <input
                type="number"
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amortization Term
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLoanTermYears(30)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    loanTermYears === 30 ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  30 Years
                </button>
                <button
                  type="button"
                  onClick={() => setLoanTermYears(15)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    loanTermYears === 15 ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  15 Years
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-all"
            >
              Done & Return to Listings
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
