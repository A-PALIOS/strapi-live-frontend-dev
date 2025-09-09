// "use client";
// import Link from "next/link";
// import { StrapiImage } from "../StrapiImage";
// import type { FooterProps } from "@/types";
// import { useActionState } from "react";
// import { subscribeAction } from "@/data/actions";

// const INITIAL_STATE = {
//   zodErrors: null,
//   strapiErrors: null,
//   errorMessage: null,
//   successMessage: null,
// };

// export function Footer({ data }: { data: FooterProps }) {
//   if (!data) return null;

//   const [formState, formAction] = useActionState(
//     subscribeAction,
//     INITIAL_STATE
//   );

//   const zodErrors = formState?.zodErrors?.email;
//   const strapiErrors = formState?.strapiErrors?.message;

//   const errorMessage = strapiErrors || zodErrors || formState?.errorMessage;
//   const successMessage = formState?.successMessage;

  
//   const { logo, description,copyrightText,newsletterTitle, newsletterInputPlaceholder,newsletterButtonLabel, column, socialLink, bottomLink } = data;
//   console.log("Newsletter:", data)
//   return (
//     <footer className="bg-white text-gray-800 mt-16">
// <div
//   className="px-6 py-16 text-white shadow-lg"
//   style={{
//     background: "linear-gradient(90deg, #0074CC 13%, #B4D3EF 100%)",
//     boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
//   }}
// >        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
//        <div className="relative inline-block">
//           <h2 className="text-4xl font-bold">
//             Want to start a <br /> project?
//           </h2>

//           <svg viewBox="0 0 120 40"
//     className="absolute top-[40px] left-[150px] w-40 h-25" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M102.065 27.9997C102.065 30.9452 104.453 33.333 107.399 33.333C110.344 33.333 112.732 30.9452 112.732 27.9997C112.732 25.0542 110.344 22.6664 107.399 22.6664C104.453 22.6664 102.065 25.0542 102.065 27.9997ZM82.8987 26.4667L82.8987 25.4667L82.8987 26.4667ZM30.3987 26.4667L30.355 27.4658L30.3769 27.4667H30.3987V26.4667ZM1.3987 26.4667C1.64424 25.4973 1.64448 25.4974 1.64471 25.4974C1.64478 25.4975 1.64501 25.4975 1.64516 25.4976C1.64544 25.4976 1.64571 25.4977 1.64597 25.4978C1.64648 25.4979 1.64693 25.498 1.64732 25.4981C1.6481 25.4983 1.64864 25.4984 1.64896 25.4985C1.64959 25.4987 1.64935 25.4986 1.64836 25.4984C1.64631 25.4978 1.64155 25.4965 1.63492 25.4945C1.6205 25.4903 1.60335 25.4847 1.58817 25.4791C1.56971 25.4722 1.572 25.4718 1.58879 25.4809C1.59797 25.4858 1.62159 25.4991 1.65294 25.5222C1.68156 25.5433 1.73964 25.5894 1.80053 25.6654C1.86104 25.741 1.95186 25.8809 1.98645 26.0824C2.0243 26.3028 1.98066 26.517 1.8856 26.6908C1.80029 26.8468 1.6929 26.9367 1.63602 26.978C1.57653 27.0213 1.53072 27.0414 1.51905 27.0464C1.49811 27.0553 1.5212 27.0431 1.62463 27.0218C1.72112 27.002 1.86215 26.9792 2.06111 26.9561L1.94584 25.9628L1.83057 24.9695C1.39017 25.0206 1.01133 25.0885 0.73386 25.207C0.623462 25.2541 0.315407 25.3937 0.130898 25.7311C0.020762 25.9325 -0.0271238 26.1738 0.0152926 26.4208C0.0544397 26.6488 0.15863 26.8147 0.23931 26.9155C0.386617 27.0994 0.563179 27.1999 0.637482 27.2401C0.732851 27.2917 0.824798 27.329 0.890944 27.3536C0.960385 27.3795 1.0228 27.3991 1.0668 27.4121C1.08937 27.4188 1.10854 27.4242 1.12311 27.4282C1.13043 27.4302 1.13667 27.4318 1.14171 27.4331C1.14423 27.4338 1.14645 27.4344 1.14836 27.4349C1.14932 27.4351 1.1502 27.4353 1.151 27.4355C1.1514 27.4356 1.15178 27.4357 1.15214 27.4358C1.15232 27.4359 1.15257 27.4359 1.15266 27.436C1.15291 27.436 1.15316 27.4361 1.3987 26.4667ZM7.92967 25.7866L7.92607 26.7866C10.149 26.7946 13.0688 26.8451 16.8913 26.9583L16.9209 25.9588L16.9505 24.9592C13.1167 24.8457 10.1786 24.7947 7.93328 24.7866L7.92967 25.7866ZM28.8726 26.4008L28.83 27.3999C29.3294 27.4212 29.8378 27.4431 30.355 27.4658L30.3987 26.4667L30.4424 25.4677C29.9244 25.445 29.4154 25.423 28.9152 25.4017L28.8726 26.4008ZM30.3987 26.4667V27.4667C31.143 27.4667 31.8598 27.3193 32.546 27.0559L32.1877 26.1223L31.8294 25.1887C31.348 25.3735 30.8736 25.4667 30.3987 25.4667V26.4667ZM37.5515 21.2606L38.3572 21.853C40.3704 19.1152 42.3243 15.6563 44.2601 12.4663L43.4052 11.9475L42.5503 11.4288C40.5623 14.7048 38.6893 18.0253 36.7459 20.6682L37.5515 21.2606ZM53.0958 1.294L53.4062 2.2446C53.9002 2.08328 54.3959 2.00001 54.8987 2L54.8987 1L54.8987 0C54.1702 1.87159e-05 53.4651 0.121404 52.7853 0.343414L53.0958 1.294ZM54.8987 1L54.8987 2C55.481 1.99999 56.0002 2.11153 56.478 2.31482L56.8695 1.39463L57.261 0.474452C56.5339 0.165118 55.7483 -2.18153e-05 54.8987 0L54.8987 1ZM61.9207 7.50379L61.028 7.95453C62.6233 11.1139 64.3018 15.2484 66.7447 18.7972L67.5684 18.2302L68.3921 17.6631C66.0506 14.2617 64.5137 10.4205 62.8133 7.05305L61.9207 7.50379ZM80.8741 26.3774L80.7839 27.3733C81.4642 27.435 82.1687 27.4667 82.8987 27.4667L82.8987 26.4667L82.8987 25.4667C82.2267 25.4667 81.5825 25.4375 80.9644 25.3815L80.8741 26.3774ZM82.8987 26.4667L82.8987 27.4667C83.3178 27.4667 83.73 27.4674 84.1354 27.4687L84.1386 26.4687L84.1418 25.4687C83.7343 25.4674 83.3199 25.4667 82.8987 25.4667L82.8987 26.4667ZM89.0569 26.519L89.039 27.5189C91.8881 27.5699 94.3125 27.655 96.3699 27.7593L96.4205 26.7605L96.4711 25.7618C94.3896 25.6564 91.9432 25.5706 89.0748 25.5192L89.0569 26.519ZM106.207 27.7182L106.02 28.7006C106.438 28.7802 106.713 28.8457 106.877 28.8887C106.959 28.9101 107.012 28.9259 107.041 28.9348C107.056 28.9393 107.064 28.942 107.067 28.9429C107.068 28.9434 107.068 28.9434 107.066 28.9429C107.066 28.9426 107.065 28.9422 107.063 28.9417C107.062 28.9415 107.062 28.9412 107.061 28.9409C107.06 28.9407 107.06 28.9406 107.059 28.9404C107.059 28.9403 107.059 28.9402 107.059 28.9401C107.059 28.9401 107.058 28.94 107.058 28.94C107.058 28.9399 107.058 28.9399 107.399 27.9997C107.739 27.0595 107.739 27.0595 107.739 27.0594C107.739 27.0594 107.739 27.0593 107.739 27.0593C107.738 27.0592 107.738 27.0591 107.738 27.059C107.737 27.0588 107.737 27.0586 107.736 27.0583C107.735 27.0579 107.734 27.0575 107.732 27.057C107.73 27.0561 107.727 27.055 107.724 27.0539C107.717 27.0516 107.709 27.049 107.7 27.046C107.682 27.0399 107.659 27.0324 107.63 27.0235C107.572 27.0057 107.492 26.9824 107.385 26.9543C107.171 26.8982 106.851 26.8229 106.394 26.7359L106.207 27.7182Z" fill="url(#paint0_linear_1012_713)"/>
// <defs>
// <linearGradient id="paint0_linear_1012_713" x1="6.48447" y1="3.99997" x2="104.398" y2="26.0771" gradientUnits="userSpaceOnUse">
// <stop offset="0.130208" stopColor="#0090FE"/>
// <stop offset="1" stopColor="#B4D3EF"/>
// </linearGradient>
// </defs>
// </svg>



//           </div>
//           <form className="space-y-4">
//             <select className="w-full bg-transparent border-b border-white placeholder-white text-white outline-none">
//               <option value="small" className="text-black">Small</option>
//               <option value="medium" className="text-black">Medium</option>
//               <option value="large" className="text-black">Large</option>
//             </select>
//             <input
//               type="email"
//               placeholder="Email"
//               className="w-full bg-transparent border-b border-white placeholder-white text-white outline-none"
//             />
//             <button
//               type="submit"
//               className="bg-white text-black px-6 py-2 font-semibold rounded shadow"
//             >
//               Let’s talk →
//             </button>
//           </form>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
//         {/* Logo and description */}
//         <div>
//           {logo && (
//             <StrapiImage
//               src={logo.image.url}
//               alt={logo.image.alternativeText || ""}
//               width={120}
//               height={60}
//               className="mb-4"
//             />
//           )}
//           <p className="text-sm text-gray-500 mb-4">
//             {description}
//           </p>
//           <p className="text-xs text-gray-400">{copyrightText}</p>
//         </div>

//         {/* Columns */}
//         {column?.map((col) => (
//           <div key={col.title}>
//             <h4 className="text-sm font-semibold text-blue-600 mb-2">{col.title}</h4>
//             <ul className="space-y-2 text-sm text-gray-600">
//          {col.link?.map((l) => (
//   l.href && (
//     <li key={l.id}>
//       <Link
//         href={l.href}
//         target={l.isExternal ? "_blank" : "_self"}
//         className="hover:underline"
//       >
//         {l.text}
//       </Link>
//     </li>
//   )
// ))}
//             </ul>
//           </div>
//         ))}

//         {/* Newsletter */}
//         <div>
//           <h4 className="text-sm font-semibold text-blue-600 mb-2">{newsletterTitle}</h4>
//           <form className="newsletter__form" action={formAction}>
//             <input
//               type="email"
//               name="email"
//               placeholder={errorMessage || successMessage || newsletterInputPlaceholder}
//               className="w-full border px-3 py-2 mb-2 rounded"
//             />
//             <button type = "submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
//               {newsletterButtonLabel}
//             </button>
//           </form>
//           <div className="flex gap-4 mt-4 text-blue-600">
//        {socialLink?.map((link) =>
//   link.href ? (
//     <Link
//       key={link.id}
//       href={link.href}
//       target={link.isExternal ? "_blank" : "_self"}
//       className="text-xl"
//     >
//       {link.text}
//     </Link>
//   ) : null
// )}
//           </div>
//         </div>
//       </div>

//       {/* Bottom bar */}
//       <div className="border-t border-gray-200 py-4 text-sm text-gray-500 flex flex-col md:flex-row justify-between px-6 max-w-7xl mx-auto gap-4">
//         {bottomLink?.map((item) =>
//   item.href ? (
//     <Link
//       key={item.id}
//       href={item.href}
//       target={item.isExternal ? "_blank" : "_self"}
//       className="flex items-center gap-2"
//     >
//       {item.text}
//     </Link>
//   ) : (
//     <span key={item.id} className="flex items-center gap-2">
//       {item.text}
//     </span>
//   )
// )}
//       </div>
//     </footer>
//   );
// }
