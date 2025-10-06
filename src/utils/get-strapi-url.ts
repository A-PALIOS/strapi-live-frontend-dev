// export function getStrapiURL() {
//  return process.env.STRAPI_API_URL ?? "http://localhost:1337";
// }
// export function getStrapiURL2() {
//  return process.env.STRAPI_API_URL ?? "http://localhost:1337";
// }

//******Code for Production ************************** */
export function getStrapiURL(path: string = ""): string {
  // console.log("[Strapi PATH at runtime] :",path);
  // console.log("[Strapi PATH at runtime] :",process.env.STRAPI_API_URL );

  return (process.env.STRAPI_API_URL ) + path;
  // return path;

}

export function getStrapiURL2(path: string = ""): string {
  // console.log("[Strapi PATH at runtime] 2:",path);
  // console.log("[Strapi PATH at runtime] 2:",process.env.STRAPI_API_URL );

  return (process.env.NEXT_PUBLIC_STRAPI_API_URL) + path;
  // return path;

}
//******Code for Production ************************** */




//******Code for Localhost ************************** */


// export function getStrapiURL(path: string = ""): string {
//   const baseUrl = process.env.STRAPI_API_URL || "http://localhost:1337";
//   return baseUrl.replace(/\/$/, "") + path;
// }
// export function getStrapiURL2() {
//   // Absolute, with protocol, no trailing slash
//   const base = (process.env.NEXT_PUBLIC_STRAPI_URL || "http://").trim();
//   return base.replace(/\/+$/, "");
// }

//******Code for Localhost ************************** */
