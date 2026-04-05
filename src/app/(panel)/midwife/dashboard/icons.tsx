import React from "react";

export function CoinSymbol({ name }: { name: string }) {
  if (name.includes("Appointments")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="6" width="14" height="13" rx="2" stroke="white" strokeWidth="1.8" />
        <path d="M8 4V8M16 4V8M8 11H16M8 15H12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (name.includes("High-Risk Mothers")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z" stroke="white" strokeWidth="1.8" />
        <path d="M5 19C5.8 16.6 8.4 15 12 15C15.6 15 18.2 16.6 19 19" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M18.5 5.5L20.5 7.5L18.5 9.5M20.5 5.5L16.5 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name.includes("Missed Visits")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="6" width="14" height="13" rx="2" stroke="white" strokeWidth="1.8" />
        <path d="M8 4V8M16 4V8M8 11H16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 15L15 9M15 15L9 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (name.includes("Pending Requests")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M8 7.5H16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 12H14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 16.5H12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="5" y="4.5" width="14" height="15" rx="2.5" stroke="white" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name.includes("Delivery")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3" stroke="white" strokeWidth="1.8" />
        <path d="M9 19C9 16.7909 10.7909 15 13 15H14C15.6569 15 17 16.3431 17 18V19" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7 19C7.2 15.8 9.3 13.8 12 13.8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M8.4 9.1C9.2 8.25 10.33 7.8 11.56 7.8C12.78 7.8 13.91 8.25 14.72 9.1L16.1 10.52C16.3 10.73 16.3 11.06 16.1 11.27L15.16 12.23C14.96 12.44 14.63 12.44 14.43 12.23L12.88 10.64C12.15 9.89 10.96 9.89 10.23 10.64L8.36 12.56C7.63 13.31 7.63 14.52 8.36 15.27L10.23 17.19C10.96 17.94 12.15 17.94 12.88 17.19L14.43 15.6C14.63 15.39 14.96 15.39 15.16 15.6L16.1 16.56C16.3 16.77 16.3 17.1 16.1 17.31L14.72 18.73C13.91 19.58 12.78 20.03 11.56 20.03C10.33 20.03 9.2 19.58 8.4 18.73L6.52 16.81C4.88 15.12 4.88 12.71 6.52 11.02L8.4 9.1Z"
        fill="white"
        fillOpacity="0.92"
      />
    </svg>
  );
}

export function ArrowUpRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WalletMiniIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="12" rx="3" stroke="white" strokeWidth="1.6" />
      <path
        d="M15 10H20V14H15C13.9 14 13 13.1 13 12C13 10.9 13.9 10 15 10Z"
        fill="white"
        fillOpacity="0.9"
      />
    </svg>
  );
}

export function WalletIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M15 10H20V14H15C13.9 14 13 13.1 13 12C13 10.9 13.9 10 15 10Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 11V8.5C8 6.29 9.79 4.5 12 4.5C14.21 4.5 16 6.29 16 8.5V11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="6"
        y="11"
        width="12"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}