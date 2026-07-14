/**
 * Petty cash entry as stored/passed around the app.
 * `balance` is not stored here: it is a running balance derived from the
 * opening balance and every entry up to and including this one.
 */
export interface PettyCashEntry {
  id: string;
  date: string;
  name: string;
  description: string;
  account: string;
  amount: number;
}

/** A petty cash entry with its running balance resolved, ready for display. */
export interface PettyCashRow extends PettyCashEntry {
  balance: number;
}

export const ACCOUNTS = ['Cash', 'Bank', 'Card'];

/** Petty cash float the running balance is drawn down from. */
export const OPENING_BALANCE = 50000;

/**
 * Walks entries oldest -> newest so each one's balance reflects every entry
 * before it, then returns them newest first for the list.
 */
export const withRunningBalance = (
  entries: PettyCashEntry[],
  openingBalance: number = OPENING_BALANCE,
): PettyCashRow[] => {
  const oldestFirst = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  let balance = openingBalance;

  return oldestFirst
    .map(entry => {
      balance -= entry.amount;
      return { ...entry, balance };
    })
    .reverse();
};

export const formatDisplayDate = (d: Date) =>
  d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const parseIncomingDate = (dateStr: string) => {
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};
