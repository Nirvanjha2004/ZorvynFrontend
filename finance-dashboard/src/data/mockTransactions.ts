import type { Transaction } from '../types'

export const mockTransactions: Transaction[] = [
  // February 2025
  { id: '1',  date: '2025-02-01', description: 'Monthly Salary',        amount: 5000, type: 'income',  category: 'Salary' },
  { id: '2',  date: '2025-02-03', description: 'Grocery Shopping',      amount: 120,  type: 'expense', category: 'Food' },
  { id: '3',  date: '2025-02-05', description: 'Rent Payment',          amount: 1200, type: 'expense', category: 'Rent' },
  { id: '4',  date: '2025-02-08', description: 'Netflix Subscription',  amount: 15,   type: 'expense', category: 'Entertainment' },
  { id: '5',  date: '2025-02-10', description: 'Bus Pass',              amount: 45,   type: 'expense', category: 'Transport' },
  { id: '6',  date: '2025-02-14', description: 'Doctor Visit',          amount: 80,   type: 'expense', category: 'Healthcare' },
  { id: '7',  date: '2025-02-18', description: 'Online Shopping',       amount: 95,   type: 'expense', category: 'Shopping' },
  { id: '8',  date: '2025-02-22', description: 'Electricity Bill',      amount: 60,   type: 'expense', category: 'Utilities' },

  // March 2025
  { id: '9',  date: '2025-03-01', description: 'Monthly Salary',        amount: 5000, type: 'income',  category: 'Salary' },
  { id: '10', date: '2025-03-02', description: 'Freelance Project',     amount: 800,  type: 'income',  category: 'Other' },
  { id: '11', date: '2025-03-04', description: 'Grocery Shopping',      amount: 140,  type: 'expense', category: 'Food' },
  { id: '12', date: '2025-03-05', description: 'Rent Payment',          amount: 1200, type: 'expense', category: 'Rent' },
  { id: '13', date: '2025-03-10', description: 'Gym Membership',        amount: 40,   type: 'expense', category: 'Healthcare' },
  { id: '14', date: '2025-03-12', description: 'Uber Rides',            amount: 55,   type: 'expense', category: 'Transport' },
  { id: '15', date: '2025-03-15', description: 'Concert Tickets',       amount: 110,  type: 'expense', category: 'Entertainment' },
  { id: '16', date: '2025-03-20', description: 'Clothing Purchase',     amount: 180,  type: 'expense', category: 'Shopping' },
  { id: '17', date: '2025-03-25', description: 'Internet Bill',         amount: 50,   type: 'expense', category: 'Utilities' },

  // April 2025
  { id: '18', date: '2025-04-01', description: 'Monthly Salary',        amount: 5000, type: 'income',  category: 'Salary' },
  { id: '19', date: '2025-04-03', description: 'Restaurant Dinner',     amount: 75,   type: 'expense', category: 'Food' },
  { id: '20', date: '2025-04-05', description: 'Rent Payment',          amount: 1200, type: 'expense', category: 'Rent' },
  { id: '21', date: '2025-04-08', description: 'Pharmacy',              amount: 35,   type: 'expense', category: 'Healthcare' },
  { id: '22', date: '2025-04-12', description: 'Spotify Premium',       amount: 10,   type: 'expense', category: 'Entertainment' },
  { id: '23', date: '2025-04-15', description: 'Bonus Payment',         amount: 1000, type: 'income',  category: 'Other' },
  { id: '24', date: '2025-04-18', description: 'Water & Gas Bill',      amount: 70,   type: 'expense', category: 'Utilities' },
]
