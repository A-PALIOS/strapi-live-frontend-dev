// import type { Block } from "@/types";

// import { HeroSection } from "@/components/blocks/HeroSection";
// import { InfoBlock } from "@/components/blocks/InfoBlock";
// import {MilestoneBlock} from "@/components/blocks/MilestoneBlock";
// import {VerticalAccordionBlock} from "@/components/blocks/VerticalAccordionBlock";
// import {ServicesAccordionBlock} from "@/components/blocks/ServicesAccordionBlock";
// import {LogoCarouselBlock} from "@/components/blocks/LogoCarouselBlock";
// import { TestimonialsBlock } from "@/components/blocks/TestimonialsBlock";
// import { FeaturesBlock } from "@/components/blocks/FeatureBlocks";
// import { FeaturedArticle } from "@/components/blocks/FeaturedArticle";
// import { AboutSection } from "@/components/blocks/AboutSection";
// import { AboutInfo } from "@/components/blocks/AboutInfo";
// import { FullImage } from "@/components/blocks/FullImage";
// import { Heading } from "@/components/blocks/Heading";
// import { Paragraph } from "@/components/blocks/Paragraph";
// import { ParagraphWithImage } from "@/components/blocks/ParagraphWithImage";
// import { StickyMenuBlock } from "@/components/blocks/StickyMenuBlock";
// import { TeamGrid } from "@/components/blocks/TeamGrid";
// import { HeroSectionMain } from "@/components/blocks/HeroSectionMain";


// function blockRenderer(block: Block, index: number,allBlocks: Block[]) {
    
//   switch (block.__component) {
//         case "blocks.hero-section-main":
//       return <HeroSectionMain {...block} key={index} />;
//     case "blocks.hero-section":
//       return <HeroSection {...block} key={index} />;
//     case "blocks.info-block":
//       return <InfoBlock {...block} key={index} />;
//     case "blocks.milestones-block":
//       return <MilestoneBlock {...block} key={index} />;
//     case "blocks.vertical-accordion-block":
//        return <VerticalAccordionBlock {...block} key={index} />;
//     case "blocks.services-accordion-block":
//        return <ServicesAccordionBlock {...block} key={index}  />;
//     case "blocks.logo-carousel-block":
//        return <LogoCarouselBlock  {...block} key={index}  />;
//     case "blocks.testimonials-block":
//         return <TestimonialsBlock {...block} key={index} />;
//     case "blocks.features-block" :
//         return <FeaturesBlock {...block} key={index} />;
//     case "blocks.featured-article":
//         return <FeaturedArticle {...block} key={index}/>;
//     case "blocks.about-section":
//         return <AboutSection {...block} key={index} />;
//     case "blocks.about-info":
//         return <AboutInfo {...block} key={index} />;
//     case "blocks.heading":
//       return <Heading {...block} key={index} />;
//     case "blocks.paragraph-with-image":
//       return <ParagraphWithImage {...block} key={index} />;
//     case "blocks.paragraph":
//       return <Paragraph {...block} key={index} />;
//     case "blocks.full-image":
//       return <FullImage {...block} key={index} />;
//     case "blocks.sticky-menu": {
//       const aboutInfoBlocks = allBlocks.filter(
//         (b): b is Block & { __component: "blocks.about-info" } =>
//           b.__component === "blocks.about-info"
//       );
//       return (
//         <StickyMenuBlock
//           {...block}
//           aboutInfoBlocks={aboutInfoBlocks}

//           key={index}
//         />
//       );
//     }
//     case "blocks.team-grid":
//       return <TeamGrid {...block} key={index}></TeamGrid>
//     default:
//       return null;
//   }
// }

// export function BlockRenderer({ blocks }: { blocks: Block[] }) {
//   return blocks.map((block, index) => blockRenderer(block, index,blocks));
// }


import type { Block } from "@/types";

import { HeroSection } from "@/components/blocks/HeroSection";
import { InfoBlock } from "@/components/blocks/InfoBlock";
import { MovingText } from "@/components/blocks/MovingText";
import {MilestoneBlock} from "@/components/blocks/MilestoneBlock";
import {VerticalAccordionBlock} from "@/components/blocks/VerticalAccordionBlock";
import {ServicesAccordionBlock} from "@/components/blocks/ServicesAccordionBlock";
import { LeadingInstitutionBlock } from "@/components/blocks/LeadingInstitutionBlock";
import {LogoCarouselBlock} from "@/components/blocks/LogoCarouselBlock";
import { TestimonialsBlock } from "@/components/blocks/TestimonialsBlock";
import { FeaturesBlock } from "@/components/blocks/FeatureBlocks";
import { FeaturedArticle } from "@/components/blocks/FeaturedArticle";
import { AboutSection } from "@/components/blocks/AboutSection";
import { AboutInfo } from "@/components/blocks/AboutInfo";
import { TimeLine } from "@/components/blocks/TimeLine";
import { FullImage } from "@/components/blocks/FullImage";
import { Heading } from "@/components/blocks/Heading";
import { Paragraph } from "@/components/blocks/Paragraph";
import { ParagraphWithImage } from "@/components/blocks/ParagraphWithImage";
import { StickyMenuBlock } from "@/components/blocks/StickyMenuBlock";
import { TeamGrid } from "@/components/blocks/TeamGrid";
import { HeroSectionMain } from "@/components/blocks/HeroSectionMain";
import { SecondaryMenuBlock } from "@/components/blocks/SecondaryMenuBlock";
import { mapSecondaryMenu } from "@/utils/mapSecondaryMenu";
import { MagicBentoBlock } from "@/components/blocks/MagicBentoBlock";
import { HeroSectionDigital } from "@/components/blocks/HeroSectionDigital";
import { ServiceInfo } from "@/components/blocks/ServiceInfo";
import { WhatWeBelieve } from "@/components/blocks/WhatWeBelieve";
import { Mission } from "@/components/blocks/Mission";
import {AICardsBlock} from "@/components/blocks/AICardsBlock"
import { UseCasesSection } from "./blocks/UseCasesSection";
import { CaseHighlight } from "./blocks/CaseHighlight";
import { InfoBox } from "./blocks/InfoBox";
import { CoverflowShowcase } from "@/components/blocks/CoverflowShowcase";
import DashboardSection1 from "./blocks/DashboardSection1";
import DashboardSection2 from "./blocks/DashboardSection2";
import DashboardSection3 from "./blocks/DashboardSection3";
import DashboardSection4 from "./blocks/DashboardSection4";
import DashboardSection5 from "./blocks/DashboardSection5";
import { StatementSection } from "./blocks/StatementSection";
import { CompanyHighlights } from "./blocks/CompanyHighlights";
import { AboutUsStatement } from "./blocks/AboutUsStatement";
import { ExpertiseGrid } from "./blocks/ExpertiseGrid";
import { ExpertiseVideoTabs } from "./blocks/ExpertiseVideoTabs";
import { ProcessSteps } from "./blocks/ProcessSteps";
import { WhatSetsUsApart } from "./blocks/WhatSetUsApart";
import { ImpactLinks } from "./blocks/ImpactLinks";
import { TwoColumnText } from "./blocks/TwoColumnText";
import { AccordionAbout } from "./blocks/AccordionAbout";
import { HeroSectionServiceBlock } from "./blocks/HeroSectionServiceBlock";


function blockRenderer(block: Block, index: number,allBlocks: Block[],secondaryMenus?: any[]) {
    
  switch (block.__component) {
        case "blocks.hero-section-main":
      return <HeroSectionMain {...block} key={index} />;
    case "blocks.hero-section":
      return <HeroSection {...block} key={index} />;
    case "blocks.hero-section-services":
      return <HeroSectionServiceBlock {...block} key={index} />
     case "blocks.hero-section-digital":
      return <HeroSectionDigital {...block} key={index} />;
    case "blocks.info-block":
      return <InfoBlock {...block} key={index} />;
    case "blocks.moving-text":
      return <MovingText {...block} key={index} />;
    case "blocks.milestones-block":
      return <MilestoneBlock {...block} key={index} />;
    case "blocks.vertical-accordion-block":
       return <VerticalAccordionBlock {...block} key={index} />;
    case "blocks.services-accordion-block":
       return <ServicesAccordionBlock {...block} key={index}  />;
    case "blocks.accordion-about":
        return <AccordionAbout {...block} key={index} />
    case "blocks.logo-carousel-block":
       return <LogoCarouselBlock  {...block} key={index}  />;
    case "blocks.leading-institution-block":
      return <LeadingInstitutionBlock {...block} key={index} />;
    case "blocks.testimonials-block":
        return <TestimonialsBlock {...block} key={index} />;
    case "blocks.features-block" :
        return <FeaturesBlock {...block} key={index} />;
    case "blocks.featured-article":
        return <FeaturedArticle {...block} key={index}/>;
    case "blocks.about-section":
        return <AboutSection {...block} key={index} />;
    case "blocks.about-info":
        return <AboutInfo {...block} key={index} />;
    case "blocks.info-box":
        return <InfoBox {...block} key={index} />;
    case "blocks.about-us-statement":
        return <AboutUsStatement {...block} key={index} />;
    case "blocks.what-believe":
        return <WhatWeBelieve {...block} key={index} />;
    case "blocks.expertise-grid":
      return <ExpertiseGrid {...block} key={index} />
    case "blocks.process-steps":
      return <ProcessSteps {...block} key={index} />;
    case "blocks.mission-section":
      return <Mission {...block} key={index} />;

    case "blocks.timeline-block":
        return <TimeLine {...block} key={index} />;
    case "blocks.service-info":
        return <ServiceInfo {...block} key={index} />;  
    case "blocks.magic-bento-block":
        return <MagicBentoBlock {...block} key={index} />;
    case "blocks.expertise-video-tabs":
      return <ExpertiseVideoTabs {...block} key={index} />;

    case "blocks.two-column-text":
      return <TwoColumnText {...block} key={index} />
    
    case "blocks.statement-section":
      return <StatementSection {...block} key={index} />
    case "blocks.what-sets-us-apart":
      return <WhatSetsUsApart {...block} key={index} />
      
    case "blocks.heading":
      return <Heading {...block} key={index} />;
    case "blocks.paragraph-with-image":
      return <ParagraphWithImage {...block} key={index} />;
    case "blocks.paragraph":
      return <Paragraph {...block} key={index} />;
    case "blocks.full-image":
      return <FullImage {...block} key={index} />;
    case "blocks.ai-cards":
      return <AICardsBlock {...block} key={index} />;
    case "blocks.impact-links":
      return <ImpactLinks {...block} key={index} />;
    case "blocks.use-cases-section":
      return <UseCasesSection data={block} key={index} />;
    case "blocks.case-highlight":
      return <CaseHighlight data={block} key={index} />;
    case "blocks.company-highlights":
      return <CompanyHighlights {...block} key={index} />
    case "blocks.coverflow-showcase":
      return <CoverflowShowcase {...(block as any)} key={index} />;
    case "blocks.dashboard-section1":
      return <DashboardSection1 {...block} key={index} />;
    case "blocks.dashboard-section2":
      return <DashboardSection2 {...block} key={index} />;
    case "blocks.dashboard-section3":
      return <DashboardSection3 {...block} key={index} />;
    case "blocks.dashboard-section4":
      return <DashboardSection4 {...block} key={index} />;
    case "blocks.dashboard-section5":
      return <DashboardSection5 {...block} key={index} />;
    case "blocks.sticky-menu": {
      const aboutInfoBlocks = allBlocks.filter(
        (b): b is Block & { __component: "blocks.about-info" } =>
          b.__component === "blocks.about-info"
      );
      // const secondaryMenuBlock = allBlocks.filter(
      //   (b): b is Block & { __component: "blocks.about-info" } =>
      //     b.__component === "blocks.about-info"
      // );
      // map page-level relation -> props for SecondaryMenuBlock
      // <StickyMenuBlock
      //       {...block}
      //       aboutInfoBlocks={aboutInfoBlocks}
      //
      //       key={index}
      //     />
      //const menuProps = mapSecondaryMenu(secondaryMenus);

      // const sm = secondaryMenu?.data?.attributes ?? secondaryMenu; // support both shapes
      // const menuProps = mapSecondaryMenu(sm);

      // if no related menu found, render nothing (or fall back to old StickyMenuBlock)

      const first = Array.isArray(secondaryMenus) ? secondaryMenus[0] : undefined;
      const second = Array.isArray(secondaryMenus) ? secondaryMenus[1] : undefined;

      console.log("SMENU",secondaryMenus)
      const sm = first?.data?.attributes ?? first;
      console.log("SMENU",sm)
      const menuProps = mapSecondaryMenu(sm);


      const gm = second?.data?.attributes ?? second;
      const GlobalmenuProps = mapSecondaryMenu(gm);

       if (!menuProps) {
        // Visible fallback so you KNOW this case ran
        return (
          <div key={`secondary-fallback-${index}`} className=" top-0 z-50 bg-yellow-50 text-yellow-800 px-4 py-2">
            Secondary menu is not populated for this page (rendering legacy sticky menu instead).
            {/*
              Uncomment the next line if you want to fall back to the legacy block's own props.
            */}
            {/* <StickyMenuBlock {...(block as any)} aboutInfoBlocks={aboutInfoBlocks} /> */}
          </div>
        );
      }

      return (
        <SecondaryMenuBlock
          {...menuProps}
          global={GlobalmenuProps}
          aboutInfoBlocks={aboutInfoBlocks}
          key={index}
        />
      );
    }
    // case "blocks.secondary-menu": {
    //   const aboutInfoBlocks = allBlocks.filter(
    //     (b): b is Block & { __component: "blocks.about-info" } =>
    //       b.__component === "blocks.about-info"
    //   );
    //   return (
    //     <SecondaryMenuBlock
    //       {...block}
    //       aboutInfoBlocks={aboutInfoBlocks}

    //       key={index}
    //     />
    //   );
    // }
    case "blocks.team-grid":
      return <TeamGrid {...block} key={index}></TeamGrid>
    default:
      return null;
  }
}

export function BlockRenderer({ blocks, secondaryMenus }: { blocks: Block[],  secondaryMenus?: any[]; }) {
  return blocks.map((block, index) => blockRenderer(block, index,blocks,secondaryMenus));
}