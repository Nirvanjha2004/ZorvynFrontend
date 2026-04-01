# Requirements Document

## Introduction

A clean, interactive finance dashboard built with React and Tailwind CSS. Users can track financial activity including balances, income, expenses, and transactions. The dashboard simulates role-based UI behavior (Admin vs Viewer) on the frontend using mock/static data, with optional local storage persistence.

## Glossary

- **Dashboard**: The main overview page showing financial summary cards and charts
- **Transaction**: A single financial record with date, amount, category, and type (income or expense)
- **Role**: A simulated user role (Admin or Viewer) that controls UI capabilities
- **Admin**: A role that can add and edit transactions
- **Viewer**: A role that can only view data
- **Insight**: A derived observation from transaction data (e.g., highest spending category)
- **Category**: A label grouping transactions (e.g., Food, Rent, Salary, Entertainment)
- **Summary Card**: A UI widget displaying a single key metric (e.g., Total Balance)
- **Filter**: A UI control that narrows the displayed transaction list
- **Chart**: A visual representation of financial data (time-based or categorical)

---

## Requirements

### Requirement 1: Dashboard Overview

**User Story:** As a user, I want to see a financial summary at a glance, so that I can quickly understand my overall financial health.

#### Acceptance Criteria

1. THE Dashboard SHALL display a Total Balance summary card showing the net of all income minus all expenses
2. THE Dashboard SHALL display an Income summary card showing the total of all income-type transactions
3. THE Dashboard SHALL display an Expenses summary card showing the total of all expense-type transactions
4. THE Dashboard SHALL display at least one time-based chart showing balance or spending trend over time (e.g., monthly)
5. THE Dashboard SHALL display at least one categorical chart showing spending breakdown by category
6. WHEN no transactions exist, THE Dashboard SHALL display empty state messages in place of charts and summary cards showing zero values

---

### Requirement 2: Transactions Section

**User Story:** As a user, I want to explore my transaction history, so that I can review individual financial events.

#### Acceptance Criteria

1. THE Transactions Section SHALL display a list of transactions each showing: date, amount, category, and type (income or expense)
2. WHEN a user applies a filter by type (income or expense), THE Transactions Section SHALL display only transactions matching that type
3. WHEN a user applies a filter by category, THE Transactions Section SHALL display only transactions matching that category
4. WHEN a user enters a search term, THE Transactions Section SHALL display only transactions whose description or category contains the search term (case-insensitive)
5. WHEN a user selects a sort option, THE Transactions Section SHALL reorder the displayed transactions accordingly (by date or amount)
6. WHEN no transactions match the active filters, THE Transactions Section SHALL display an empty state message

---

### Requirement 3: Role-Based UI

**User Story:** As a developer demonstrating the app, I want to switch between Admin and Viewer roles, so that I can show how the UI adapts to different permission levels.

#### Acceptance Criteria

1. THE Application SHALL provide a role selector (dropdown or toggle) allowing the user to switch between Admin and Viewer roles
2. WHILE the Viewer role is active, THE Application SHALL display transaction data in read-only mode with no add or edit controls visible
3. WHILE the Admin role is active, THE Application SHALL display controls to add a new transaction
4. WHILE the Admin role is active, THE Application SHALL display controls to edit an existing transaction
5. WHEN an Admin submits a new transaction form with valid data, THE Application SHALL add the transaction to the transaction list and update all summary cards and charts
6. IF an Admin submits a new transaction form with missing required fields, THEN THE Application SHALL display a validation error and prevent submission

---

### Requirement 4: Insights Section

**User Story:** As a user, I want to see simple insights derived from my data, so that I can understand my spending patterns without manual analysis.

#### Acceptance Criteria

1. THE Insights Section SHALL display the highest spending category based on total expense amount across all transactions
2. THE Insights Section SHALL display a month-over-month comparison showing whether total spending increased or decreased compared to the previous month
3. THE Insights Section SHALL display the average monthly expense amount
4. WHEN no transactions exist, THE Insights Section SHALL display placeholder messages indicating no data is available

---

### Requirement 5: State Management

**User Story:** As a user, I want the application to maintain consistent state across interactions, so that filters, role selection, and data changes are reflected everywhere immediately.

#### Acceptance Criteria

1. THE Application SHALL maintain transaction data in a centralized state accessible to all components
2. WHEN a transaction is added or edited, THE Application SHALL update all dependent UI (summary cards, charts, insights, transaction list) without requiring a page reload
3. THE Application SHALL maintain the active role selection in state and apply it consistently across all components
4. THE Application SHALL maintain active filter and search state so that navigating between sections does not reset filters
5. WHERE local storage is available, THE Application SHALL persist transaction data and role selection across page refreshes

---

### Requirement 6: UI and UX

**User Story:** As a user, I want a clean and responsive interface, so that I can use the dashboard comfortably on any device.

#### Acceptance Criteria

1. THE Application SHALL render correctly and be usable on screen widths from 320px (mobile) to 1440px (desktop)
2. THE Application SHALL use a consistent visual design with clear typography, spacing, and color hierarchy
3. WHEN data is loading or unavailable, THE Application SHALL display appropriate empty states or placeholder content rather than broken layouts
4. THE Application SHALL provide clear visual distinction between income and expense transactions (e.g., color coding)
5. THE Application SHALL include navigation between the Dashboard, Transactions, and Insights sections
