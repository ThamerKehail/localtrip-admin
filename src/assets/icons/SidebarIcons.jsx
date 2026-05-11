// Sidebar navigation icons — all use currentColor for stroke/fill
// so they automatically adapt to active (text-white) and inactive (text-gray-500) states.

export function IconDashboard({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top-left: tall rectangle */}
      <path d="M2.25 4C2.25 3.0335 3.0335 2.25 4 2.25H9.5C10.4665 2.25 11.25 3.0335 11.25 4V11.5C11.25 12.4665 10.4665 13.25 9.5 13.25H4C3.0335 13.25 2.25 12.4665 2.25 11.5V4Z" fill="currentColor"/>
      {/* Top-right: short rectangle */}
      <path d="M12.75 4C12.75 3.0335 13.5335 2.25 14.5 2.25H20C20.9665 2.25 21.75 3.0335 21.75 4V7.5C21.75 8.4665 20.9665 9.25 20 9.25H14.5C13.5335 9.25 12.75 8.4665 12.75 7.5V4Z" fill="currentColor"/>
      {/* Bottom-left: short rectangle */}
      <path d="M2.25 16.5C2.25 15.5335 3.0335 14.75 4 14.75H9.5C10.4665 14.75 11.25 15.5335 11.25 16.5V20C11.25 20.9665 10.4665 21.75 9.5 21.75H4C3.0335 21.75 2.25 20.9665 2.25 20V16.5Z" fill="currentColor"/>
      {/* Bottom-right: tall rectangle */}
      <path d="M12.75 12.5C12.75 11.5335 13.5335 10.75 14.5 10.75H20C20.9665 10.75 21.75 11.5335 21.75 12.5V20C21.75 20.9665 20.9665 21.75 20 21.75H14.5C13.5335 21.75 12.75 20.9665 12.75 20V12.5Z" fill="currentColor"/>
    </svg>
  );
}

export function IconDestinations({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M18.0006 9.6C18.0006 12.4 14.5006 14 14.5006 14C14.5006 14 11.0006 12.4 11.0006 9.6C11.0006 7.61177 12.5676 6 14.5006 6C16.4336 6 18.0006 7.61177 18.0006 9.6Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14.4994 9.49992H14.5091" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22.0006 11.9999C22.0006 17.5227 17.5234 21.9999 12.0006 21.9999C6.47777 21.9999 2.00062 17.5227 2.00062 11.9999C2.00062 6.47707 6.47777 1.99992 12.0006 1.99992C17.5234 1.99992 22.0006 6.47707 22.0006 11.9999Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 15L5 19M15 21L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconBookings({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M15.9999 2.00002V6.00002M7.99988 2.00002V6.00002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 3.99998H11C7.22876 3.99998 5.34315 3.99998 4.17157 5.17155C3 6.34313 3 8.22874 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C21 19.6569 21 17.7712 21 14V12C21 8.22874 21 6.34313 19.8284 5.17155C18.6569 3.99998 16.7712 3.99998 13 3.99998Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 9.99998H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 16.5C9 16.5 10.5 17 11 18.5C11 18.5 13.1765 14.5 16 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconTrips({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M21.9999 10V9.21751C21.9999 7.27789 21.9999 6.30809 21.4141 5.70552C20.8283 5.10296 19.8855 5.10296 17.9999 5.10296H15.9213C15.0039 5.10296 14.9963 5.10118 14.1714 4.68836L10.8398 3.02116C9.44872 2.32506 8.7532 1.97701 8.01226 2.0012C7.27131 2.02539 6.59865 2.4181 5.25333 3.20353L4.02546 3.92039C3.03727 4.49731 2.54317 4.78578 2.27152 5.26566C1.99988 5.74555 1.99988 6.32995 1.99988 7.49875V15.7157C1.99988 17.2514 1.99988 18.0193 2.34214 18.4467C2.56989 18.731 2.88904 18.9222 3.24188 18.9856C3.77214 19.0808 4.42136 18.7018 5.71975 17.9437C6.60144 17.429 7.44999 16.8944 8.50475 17.0394C9.38857 17.1608 10.2099 17.7185 10.9999 18.1138" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.99988 2.00002V17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M15 5.00002V9.50002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.3084 21.6835C18.0916 21.8865 17.8018 22 17.5002 22C17.1986 22 16.9088 21.8865 16.692 21.6835C14.7064 19.813 12.0456 17.7235 13.3432 14.6898C14.0448 13.0496 15.729 12 17.5002 12C19.2714 12 20.9556 13.0496 21.6572 14.6898C22.9532 17.7196 20.2989 19.8194 18.3084 21.6835Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M17.5001 16.5H17.5095" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconGuides({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M14.9995 2.45786C14.0525 2.16041 13.0447 2.00006 11.9995 2.00006C6.47666 2.00006 1.99951 6.47721 1.99951 12.0001C1.99951 17.5229 6.47666 22.0001 11.9995 22.0001C17.5223 22.0001 21.9995 17.5229 21.9995 12.0001C21.9995 10.9549 21.8391 9.9471 21.5417 9.00006" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 9.99994C15 11.6568 13.6569 12.9999 12 12.9999C10.3431 12.9999 9 11.6568 9 9.99994C9 8.34309 10.3431 6.99994 12 6.99994C13.6569 6.99994 15 8.34309 15 9.99994Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.50049 19.5001L6.06089 18.5194C6.9511 16.9616 8.60782 16.0001 10.4021 16.0001H13.5989C15.3932 16.0001 17.0499 16.9616 17.9401 18.5194L18.5005 19.5001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.9742 2.02154C18.98 1.9929 19.021 1.9929 19.0268 2.02154C19.3307 3.50814 20.4924 4.6699 21.979 4.97374C22.0077 4.9796 22.0077 5.02052 21.979 5.02638C20.4924 5.33022 19.3307 6.49198 19.0268 7.97858C19.021 8.00722 18.98 8.00722 18.9742 7.97858C18.6703 6.49198 17.5086 5.33022 16.022 5.02638C15.9933 5.02052 15.9933 4.9796 16.022 4.97374C17.5086 4.6699 18.6703 3.50814 18.9742 2.02154Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconMessages({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8.50012 14.5H15.5001M8.50012 9.50002H12.0001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.1705 20.8905C18.3535 20.6125 21.6855 17.2332 21.9597 12.9909C22.0133 12.1607 22.0133 11.3009 21.9597 10.4707C21.6855 6.22836 18.3535 2.84911 14.1705 2.57105C12.7434 2.47619 11.2535 2.47639 9.82928 2.57105C5.64627 2.84911 2.31429 6.22836 2.04012 10.4707C1.98647 11.3009 1.98647 12.1607 2.04012 12.9909C2.13998 14.536 2.82331 15.9666 3.62779 17.1746C4.09489 18.0203 3.78662 19.0758 3.30009 19.9978C2.94929 20.6626 2.77389 20.995 2.91472 21.2351C3.05556 21.4752 3.37014 21.4829 3.99931 21.4982C5.24355 21.5285 6.08256 21.1757 6.74856 20.6846C7.12628 20.4061 7.31515 20.2668 7.44532 20.2508C7.57548 20.2348 7.83165 20.3403 8.34389 20.5513C8.80428 20.7409 9.33884 20.8579 9.82928 20.8905C11.2535 20.9852 12.7434 20.9854 14.1705 20.8905Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconPayments({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3.3457 16.1976L16.1747 3.36864M18.6316 11.0556L16.4321 13.2551M14.5549 15.1099L13.5762 16.0886" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3.17455 16.1411C1.60832 14.5749 1.60832 12.0355 3.17455 10.4693L10.4692 3.17469C12.0354 1.60846 14.5748 1.60846 16.141 3.17469L20.8252 7.85893C22.3915 9.42516 22.3915 11.9645 20.8252 13.5307L13.5306 20.8253C11.9644 22.3916 9.42502 22.3916 7.85879 20.8253L3.17455 16.1411Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4.00012 22H20.0001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconExplore({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20.25 20.25L14.75 14.75M16.75 8.75C16.75 13.1683 13.1683 16.75 8.75 16.75C4.33172 16.75 0.75 13.1683 0.75 8.75C0.75 4.33172 4.33172 0.75 8.75 0.75C13.1683 0.75 16.75 4.33172 16.75 8.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconEatDrink({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M14.9999 9.99953L3.99994 21.0005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.0835 2.9995L15.1465 5.93726C14.6131 6.47076 14.3464 6.73752 14.2038 7.02525C13.9322 7.57309 13.9322 8.21633 14.2037 8.76418C14.3463 9.05192 14.613 9.31868 15.1464 9.85221C15.68 10.386 15.9468 10.6529 16.2347 10.7956C16.7827 11.0674 17.4263 11.0675 17.9744 10.7958C18.2622 10.6532 18.5291 10.3863 19.0628 9.85261L22.0001 6.91566" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20.0001 4.99754L17.0001 7.99754" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.84479 9.84423C7.47974 11.2093 5.60777 11.5505 3.90151 9.84423C2.1952 8.13791 1.30064 5.03019 2.66569 3.66514C4.03075 2.30008 7.13847 3.19464 8.84479 4.90095C10.5511 6.60721 10.2099 8.47918 8.84479 9.84423ZM8.84479 9.84423L20.0001 20.9995" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconEvents({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M18 15L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7.83315 18.9444L9.4745 20.5858C10.2555 21.3668 11.5219 21.3668 12.3029 20.5858L20.5856 12.3031C21.3666 11.5221 21.3666 10.2557 20.5856 9.47468L18.9442 7.83333C18.1772 8.6004 16.9335 8.6004 16.1665 7.83333C15.3994 7.06627 15.3994 5.82262 16.1665 5.05556L14.5251 3.41421C13.7441 2.63316 12.4777 2.63317 11.6967 3.41421L3.41403 11.6969C2.63299 12.4779 2.63298 13.7443 3.41403 14.5253L5.05538 16.1667C5.82244 15.3996 7.06609 15.3996 7.83315 16.1667C8.60022 16.9337 8.60022 18.1774 7.83315 18.9444Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconCategories({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 5C3 3.89543 3.89543 3 5 3H8C9.10457 3 10 3.89543 10 5V8C10 9.10457 9.10457 10 8 10H5C3.89543 10 3 9.10457 3 8V5Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14 5C14 3.89543 14.8954 3 16 3H19C20.1046 3 21 3.89543 21 5V8C21 9.10457 20.1046 10 19 10H16C14.8954 10 14 9.10457 14 8V5Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 16C3 14.8954 3.89543 14 5 14H8C9.10457 14 10 14.8954 10 16V19C10 20.1046 9.10457 21 8 21H5C3.89543 21 3 20.1046 3 19V16Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M17.5 14V21M14 17.5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconCarousel({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M1 9V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M23 9V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 19L12 15L16 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function IconUsers({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
