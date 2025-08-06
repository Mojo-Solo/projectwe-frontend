import { NextRequest, NextResponse } from "next/server";

interface Framework {
  id: string;
  name: string;
  description: string;
  category: string;
  selected?: boolean;
}

interface BestPractice {
  practice: string;
  impact: string;
  priority: string;
  selected?: boolean;
}

// Generate Executive Summary Document
function generateExecutiveSummary(data: any): string {
  const {
    clientInfo,
    valuationFactors,
    currentValuation,
    optimizedValuation,
    frameworks,
    bestPractices,
  } = data;

  return `# Exit Planning Executive Summary
## ${clientInfo.companyName}

**Prepared for:** ${clientInfo.ownerName}  
**Date:** ${new Date().toLocaleDateString()}  
**Powered by:** Julie Keyes Exit Planning Intelligence™

---

## Executive Overview

Based on our comprehensive analysis using Julie Keyes' proven exit planning frameworks, we have identified significant opportunities to enhance ${clientInfo.companyName}'s value and ensure a successful exit within your ${clientInfo.exitTimeframe} timeframe.

### Key Findings

- **Current Valuation:** $${(currentValuation / 1000000).toFixed(1)}M
- **Optimized Valuation:** $${(optimizedValuation / 1000000).toFixed(1)}M
- **Potential Value Increase:** $${((optimizedValuation - currentValuation) / 1000000).toFixed(1)}M (${(((optimizedValuation - currentValuation) / currentValuation) * 100).toFixed(0)}% increase)
- **Exit Readiness Score:** ${data.readinessScore}%

### Critical Success Factors

1. **Revenue Profile**
   - Current Revenue: $${(valuationFactors.revenue / 1000000).toFixed(1)}M
   - EBITDA: $${(valuationFactors.ebitda / 1000000).toFixed(1)}M
   - EBITDA Margin: ${((valuationFactors.ebitda / valuationFactors.revenue) * 100).toFixed(1)}%

2. **Value Drivers**
   - Growth Rate: ${valuationFactors.growthRate}%
   - Recurring Revenue: ${valuationFactors.recurringRevenue}%
   - Management Depth: ${valuationFactors.managementDepth}%

3. **Risk Factors**
   - Customer Concentration: ${valuationFactors.customerConcentration}%
   ${valuationFactors.customerConcentration > 30 ? "   ⚠️ *High concentration risk - diversification recommended*" : "   ✓ *Acceptable concentration level*"}

## Strategic Recommendations

Based on the ${frameworks.filter((f: Framework) => f.selected).length} frameworks selected from Julie Keyes' proven methodologies:

${frameworks
  .filter((f: Framework) => f.selected)
  .slice(0, 5)
  .map(
    (f: Framework, i: number) => `${i + 1}. **${f.name}** - ${f.description}`,
  )
  .join("\n")}

## Immediate Action Items

${bestPractices
  .filter((bp: BestPractice) => bp.selected && bp.priority === "high")
  .slice(0, 3)
  .map(
    (bp: BestPractice, i: number) =>
      `${i + 1}. ${bp.practice} (Impact: ${bp.impact})`,
  )
  .join("\n")}

## Exit Goals Alignment

Your stated objectives:
*"${clientInfo.exitGoals || "Maximize value and ensure smooth transition"}"*

Our recommended approach directly addresses these goals through:
- Value enhancement initiatives projected to increase valuation by $${((optimizedValuation - currentValuation) / 1000000).toFixed(1)}M
- Structured succession planning to ensure continuity
- Tax optimization strategies to maximize after-tax proceeds

## Next Steps

1. **Immediate (0-30 days)**
   - Review and approve recommended frameworks
   - Engage exit planning team
   - Begin financial cleanup process

2. **Short-term (1-6 months)**
   - Implement value enhancement initiatives
   - Address identified risk factors
   - Develop buyer positioning strategy

3. **Long-term (6+ months)**
   - Execute strategic improvements
   - Build management depth
   - Prepare for market engagement

---

*This analysis is based on Julie Keyes' proven exit planning methodologies, with over 100+ successful exits and $1B+ in transaction value.*
`;
}

// Generate Valuation Analysis Document
function generateValuationAnalysis(data: any): string {
  const { clientInfo, valuationFactors, currentValuation, optimizedValuation } =
    data;

  const baseMultiple = 4.5;
  const currentMultiple = currentValuation / valuationFactors.ebitda;
  const optimizedMultiple = optimizedValuation / valuationFactors.ebitda;

  return `# Detailed Valuation Analysis
## ${clientInfo.companyName}

**Industry:** ${clientInfo.industry || "Not specified"}  
**Years in Business:** ${clientInfo.yearsInBusiness || "Not specified"}  
**Analysis Date:** ${new Date().toLocaleDateString()}

---

## Current Valuation Breakdown

### Base Metrics
- **Annual Revenue:** $${(valuationFactors.revenue / 1000000).toFixed(2)}M
- **EBITDA:** $${(valuationFactors.ebitda / 1000000).toFixed(2)}M
- **EBITDA Margin:** ${((valuationFactors.ebitda / valuationFactors.revenue) * 100).toFixed(1)}%

### Valuation Calculation
- **Base Industry Multiple:** ${baseMultiple}x EBITDA
- **Your Current Multiple:** ${currentMultiple.toFixed(2)}x EBITDA
- **Current Valuation:** $${(currentValuation / 1000000).toFixed(2)}M

### Multiple Adjustments Applied

#### Positive Factors
${valuationFactors.growthRate > 20 ? `- **High Growth Premium** (+50%): Your ${valuationFactors.growthRate}% growth rate exceeds industry average\n` : ""}${valuationFactors.recurringRevenue > 70 ? `- **Recurring Revenue Premium** (+30%): ${valuationFactors.recurringRevenue}% recurring revenue provides stability\n` : ""}${valuationFactors.managementDepth > 80 ? `- **Management Depth Bonus** (+20%): Strong second-tier management reduces buyer risk\n` : ""}

#### Negative Factors
${valuationFactors.customerConcentration > 30 ? `- **Customer Concentration Penalty** (-20%): ${valuationFactors.customerConcentration}% concentration increases risk\n` : ""}${valuationFactors.recurringRevenue < 40 ? `- **Low Recurring Revenue** (-15%): Only ${valuationFactors.recurringRevenue}% recurring impacts predictability\n` : ""}${valuationFactors.managementDepth < 50 ? `- **Owner Dependency** (-25%): Limited management depth creates transition risk\n` : ""}

## Optimized Valuation Potential

### Target Improvements
To achieve the optimized valuation of $${(optimizedValuation / 1000000).toFixed(2)}M (${optimizedMultiple.toFixed(2)}x EBITDA):

1. **Increase Recurring Revenue**
   - Current: ${valuationFactors.recurringRevenue}%
   - Target: 80%+
   - Value Impact: +$${(((optimizedValuation - currentValuation) * 0.3) / 1000000).toFixed(1)}M

2. **Reduce Customer Concentration**
   - Current: ${valuationFactors.customerConcentration}%
   - Target: <20%
   - Value Impact: +$${(((optimizedValuation - currentValuation) * 0.2) / 1000000).toFixed(1)}M

3. **Build Management Depth**
   - Current: ${valuationFactors.managementDepth}%
   - Target: 85%+
   - Value Impact: +$${(((optimizedValuation - currentValuation) * 0.15) / 1000000).toFixed(1)}M

4. **Enhance Growth Rate**
   - Current: ${valuationFactors.growthRate}%
   - Target: 25%+
   - Value Impact: +$${(((optimizedValuation - currentValuation) * 0.25) / 1000000).toFixed(1)}M

## Industry Comparisons

Based on recent transactions in your industry:
- **Average Multiple:** ${(baseMultiple * 0.9).toFixed(1)}x - ${(baseMultiple * 1.1).toFixed(1)}x EBITDA
- **Top Quartile:** ${(baseMultiple * 1.3).toFixed(1)}x - ${(baseMultiple * 1.5).toFixed(1)}x EBITDA
- **Your Position:** ${currentMultiple < baseMultiple ? "Below" : "Above"} industry average

## Valuation Sensitivity Analysis

### Impact of 10% Improvement in Key Metrics

| Metric | Current | Improved | Value Impact |
|--------|---------|----------|--------------|
| EBITDA | $${(valuationFactors.ebitda / 1000000).toFixed(1)}M | $${((valuationFactors.ebitda * 1.1) / 1000000).toFixed(1)}M | +$${((currentMultiple * valuationFactors.ebitda * 0.1) / 1000000).toFixed(1)}M |
| Growth Rate | ${valuationFactors.growthRate}% | ${(valuationFactors.growthRate * 1.1).toFixed(0)}% | +$${((currentValuation * 0.05) / 1000000).toFixed(1)}M |
| Recurring Revenue | ${valuationFactors.recurringRevenue}% | ${Math.min(100, valuationFactors.recurringRevenue + 10)}% | +$${((currentValuation * 0.08) / 1000000).toFixed(1)}M |

## Strategic Value Considerations

### Synergy Opportunities
Strategic buyers may pay premium multiples for:
- Market expansion opportunities
- Technology or IP assets
- Customer relationships
- Operational synergies

### Financial Buyer Considerations
Financial buyers typically focus on:
- Cash flow stability
- Growth potential
- Management team strength
- Market position

## Conclusion

Your business has significant untapped value potential. By implementing the recommended improvements, you can increase your valuation by $${((optimizedValuation - currentValuation) / 1000000).toFixed(1)}M (${(((optimizedValuation - currentValuation) / currentValuation) * 100).toFixed(0)}%).

The key is to begin implementing these changes now, as value creation takes time and buyers pay for demonstrated results, not just potential.

---

*Valuation analysis based on Julie Keyes' proven methodologies and current market conditions.*
`;
}

// Generate Exit Timeline Document
function generateExitTimeline(data: any): string {
  const { clientInfo, valuationFactors, frameworks } = data;
  const timeframe = clientInfo.exitTimeframe || "3-5 years";

  return `# Personalized Exit Timeline
## ${clientInfo.companyName}

**Target Exit Timeframe:** ${timeframe}  
**Prepared for:** ${clientInfo.ownerName}  
**Current Readiness Score:** ${data.readinessScore}%

---

## Your Customized Exit Roadmap

Based on your current position and Julie Keyes' proven frameworks, here's your month-by-month action plan:

### Phase 1: Foundation (Months 1-6)
*Focus: Assessment and Planning*

#### Month 1-2: Initial Assessment
- [ ] Complete comprehensive business valuation
- [ ] Identify and document all value drivers
- [ ] Assess current market conditions
- [ ] Engage exit planning advisory team
- [ ] Set specific exit goals and objectives

#### Month 3-4: Gap Analysis
- [ ] Compare current state to optimal exit position
- [ ] Identify top 5 value enhancement opportunities
- [ ] Assess management team capabilities
- [ ] Review financial systems and controls
- [ ] Document all business processes

#### Month 5-6: Strategic Planning
- [ ] Develop value enhancement roadmap
- [ ] Create financial improvement plan
- [ ] Design organizational development strategy
- [ ] Establish KPI tracking system
- [ ] Begin succession planning discussions

**Phase 1 Value Impact:** +$${(((data.optimizedValuation - data.currentValuation) * 0.1) / 1000000).toFixed(1)}M

### Phase 2: Value Enhancement (Months 7-18)
*Focus: Implementation and Growth*

#### Month 7-9: Financial Optimization
${valuationFactors.recurringRevenue < 70 ? "- [ ] Implement recurring revenue initiatives\n" : ""}${valuationFactors.ebitda / valuationFactors.revenue < 0.15 ? "- [ ] Execute margin improvement program\n" : ""}- [ ] Clean up financial statements
- [ ] Implement robust financial controls
- [ ] Optimize working capital
- [ ] Reduce unnecessary expenses

#### Month 10-12: Operational Excellence
${valuationFactors.customerConcentration > 30 ? "- [ ] Execute customer diversification strategy\n" : ""}${valuationFactors.managementDepth < 70 ? "- [ ] Build second-tier management team\n" : ""}- [ ] Document all key processes
- [ ] Implement quality management systems
- [ ] Upgrade technology infrastructure
- [ ] Strengthen vendor relationships

#### Month 13-18: Growth Acceleration
- [ ] Launch new revenue streams
- [ ] Expand into adjacent markets
- [ ] Develop strategic partnerships
- [ ] Enhance customer experience
- [ ] Build competitive advantages

**Phase 2 Value Impact:** +$${(((data.optimizedValuation - data.currentValuation) * 0.4) / 1000000).toFixed(1)}M

### Phase 3: Market Preparation (Months 19-24)
*Focus: Positioning and Marketing*

#### Month 19-21: Pre-Market Preparation
- [ ] Conduct quality of earnings review
- [ ] Prepare management presentation
- [ ] Develop growth projections
- [ ] Create confidential information memorandum
- [ ] Identify potential buyers

#### Month 22-24: Market Engagement
- [ ] Soft market outreach
- [ ] Gauge buyer interest
- [ ] Refine positioning strategy
- [ ] Address any remaining gaps
- [ ] Prepare data room

**Phase 3 Value Impact:** +$${(((data.optimizedValuation - data.currentValuation) * 0.3) / 1000000).toFixed(1)}M

### Phase 4: Transaction Execution (Final 6-12 months)
*Focus: Deal Making and Closing*

#### Months 25-27: Go to Market
- [ ] Launch formal sale process
- [ ] Distribute marketing materials
- [ ] Conduct management meetings
- [ ] Receive initial indications of interest
- [ ] Negotiate letters of intent

#### Months 28-30: Due Diligence
- [ ] Manage buyer due diligence
- [ ] Negotiate purchase agreement
- [ ] Address buyer concerns
- [ ] Maintain business performance
- [ ] Finalize deal terms

#### Final Months: Closing
- [ ] Complete final negotiations
- [ ] Obtain necessary approvals
- [ ] Execute closing documents
- [ ] Manage transition planning
- [ ] Close transaction

**Phase 4 Value Impact:** +$${(((data.optimizedValuation - data.currentValuation) * 0.2) / 1000000).toFixed(1)}M

## Critical Milestones & Checkpoints

${
  timeframe === "3-5 years"
    ? `
### Year 1 Goals
- Exit Readiness Score: 60%+
- Value Enhancement: +$${(((data.optimizedValuation - data.currentValuation) * 0.3) / 1000000).toFixed(1)}M
- Key Achievement: Financial systems upgrade complete

### Year 2 Goals  
- Exit Readiness Score: 80%+
- Value Enhancement: +$${(((data.optimizedValuation - data.currentValuation) * 0.6) / 1000000).toFixed(1)}M
- Key Achievement: Management team fully built

### Year 3+ Goals
- Exit Readiness Score: 95%+
- Value Enhancement: +$${(((data.optimizedValuation - data.currentValuation) * 0.9) / 1000000).toFixed(1)}M
- Key Achievement: Ready for successful exit
`
    : `
### Accelerated Timeline Considerations
Given your ${timeframe} timeframe, we recommend:
- Prioritizing highest-impact value drivers
- Engaging advisors immediately
- Fast-tracking financial cleanup
- Accepting some value trade-offs for speed
`
}

## Success Metrics

Track these KPIs monthly:
1. Revenue growth rate (Target: ${Math.max(15, valuationFactors.growthRate)}%+)
2. EBITDA margin (Target: ${Math.max(20, (valuationFactors.ebitda / valuationFactors.revenue) * 100)}%+)
3. Customer concentration (Target: <20%)
4. Recurring revenue % (Target: 80%+)
5. Management depth score (Target: 85%+)

## Risk Mitigation

Key risks to monitor and address:
- Market timing and economic conditions
- Competitive threats
- Key customer relationships
- Employee retention
- Regulatory changes

---

*This timeline is customized based on your specific situation and Julie Keyes' proven exit planning methodologies.*
`;
}

// Generate Tax Optimization Document
function generateTaxOptimization(data: any): string {
  const { clientInfo, currentValuation } = data;

  return `# Tax Optimization Strategies
## ${clientInfo.companyName}

**Prepared for:** ${clientInfo.ownerName}  
**Estimated Transaction Value:** $${(currentValuation / 1000000).toFixed(1)}M  
**Analysis Date:** ${new Date().toLocaleDateString()}

---

## Executive Summary

Proper tax planning can save 20-40% of your exit proceeds. Based on your situation, we've identified several strategies that could save you $${((currentValuation * 0.25) / 1000000).toFixed(1)}M or more in taxes.

## Deal Structure Comparison

### 1. Stock Sale
**Estimated Tax Rate:** 20% (Capital Gains)  
**Net Proceeds:** $${((currentValuation * 0.8) / 1000000).toFixed(1)}M

**Advantages:**
- Qualifies for favorable capital gains treatment
- Clean exit with no retained liabilities
- Simple transaction structure
- Potential for QSBS exemption (0% tax on up to $10M)

**Disadvantages:**
- Buyers often prefer asset purchases
- May require price concession
- Less flexibility in deal terms

**Best For:** ${clientInfo.yearsInBusiness > 5 ? "Your long ownership period favors this structure" : "Consider if buyer is willing"}

### 2. Asset Sale
**Estimated Tax Rate:** 37% (Ordinary Income) + State  
**Net Proceeds:** $${((currentValuation * 0.63) / 1000000).toFixed(1)}M

**Advantages:**
- Buyer preference (step-up in basis)
- Can allocate purchase price favorably
- Selective asset transfer possible
- Potential for ordinary loss deductions

**Disadvantages:**
- Higher tax rate on most proceeds
- Complex allocation negotiations
- Potential double taxation (C-corp)

**Mitigation Strategies:**
- Maximize allocation to capital assets
- Negotiate covenant not to compete separately
- Consider installment treatment

### 3. Installment Sale
**Estimated Tax Rate:** 20-25% (Deferred)  
**Net Proceeds:** $${((currentValuation * 0.75) / 1000000).toFixed(1)}M

**Advantages:**
- Defer taxes over multiple years
- Potential for lower rates
- Income stream post-exit
- Estate planning benefits

**Disadvantages:**
- Buyer credit risk
- Delayed liquidity
- Complex documentation
- Interest rate considerations

**Structure Considerations:**
- Minimum 30% down payment recommended
- 5-7 year term typical
- Secure with business assets
- Include acceleration provisions

### 4. ESOP (Employee Stock Ownership Plan)
**Estimated Tax Rate:** 0% (Tax-Deferred Rollover)  
**Net Proceeds:** $${((currentValuation * 0.9) / 1000000).toFixed(1)}M

**Advantages:**
- Tax-free rollover under Section 1042
- Maintain company legacy
- Employee incentive alignment
- Potential ongoing income stream

**Disadvantages:**
- Complex setup and administration
- Ongoing fiduciary obligations
- Limited liquidity options
- Regulatory requirements

**Requirements:**
- C-corporation status
- 30%+ sale to ESOP
- Reinvest in qualified securities
- Hold for 3+ years

## Advanced Tax Strategies

### 1. Charitable Remainder Trust (CRT)
- Immediate charitable deduction
- Defer capital gains indefinitely
- Income stream for life
- Estate tax benefits
- **Potential Savings:** $${((currentValuation * 0.15) / 1000000).toFixed(1)}M

### 2. Qualified Opportunity Zones
- Defer gains until 2026
- 10% reduction in taxable gain
- Eliminate gains on new investments
- **Potential Savings:** $${((currentValuation * 0.1) / 1000000).toFixed(1)}M

### 3. Gift/Estate Planning
- Annual exclusion gifts pre-sale
- Grantor retained annuity trusts
- Intentionally defective grantor trusts
- **Potential Savings:** $${((currentValuation * 0.2) / 1000000).toFixed(1)}M

## State Tax Considerations

### Residency Planning
Consider establishing residency in a tax-favorable state before exit:
- **No Income Tax States:** FL, TX, WA, NV, WY, SD, AK
- **Timing:** Establish residency 6-12 months before transaction
- **Requirements:** Primary residence, driver's license, voter registration

### State-Specific Strategies
- Some states offer capital gains exclusions
- Consider state tax credits and incentives
- Evaluate combined state/federal rates

## Pre-Transaction Planning

### Immediate Actions (Do Now)
1. Review current entity structure
2. Consider QSBS qualification
3. Evaluate charitable giving goals
4. Assess state residency options
5. Document all tax attributes

### 6-12 Months Before Exit
1. Implement chosen tax strategies
2. Clean up entity structure
3. Establish charitable vehicles
4. Complete residency changes
5. Maximize retirement contributions

### Transaction Year
1. Time closing for optimal tax year
2. Coordinate with tax advisors
3. Structure earnouts appropriately
4. Plan estimated tax payments
5. Document all agreements properly

## Estimated Tax Savings Summary

Based on implementing recommended strategies:

| Strategy | Potential Savings |
|----------|------------------|
| Optimal deal structure | $${((currentValuation * 0.15) / 1000000).toFixed(1)}M |
| State tax planning | $${((currentValuation * 0.05) / 1000000).toFixed(1)}M |
| Charitable strategies | $${((currentValuation * 0.03) / 1000000).toFixed(1)}M |
| Timing optimization | $${((currentValuation * 0.02) / 1000000).toFixed(1)}M |
| **Total Potential Savings** | **$${((currentValuation * 0.25) / 1000000).toFixed(1)}M** |

## Next Steps

1. **Engage tax counsel** specializing in M&A transactions
2. **Model scenarios** with your CPA
3. **Implement strategies** well before transaction
4. **Document everything** for tax positions
5. **Plan for proceeds** post-transaction

## Important Disclaimers

- Tax laws change frequently
- State taxes vary significantly  
- Individual circumstances affect strategies
- Always consult qualified tax professionals
- IRS circular 230 disclosure applies

---

*Tax strategies based on current tax law and Julie Keyes' exit planning experience. Consult your tax advisor for specific advice.*
`;
}

// Generate Best Practices Checklist
function generateBestPracticesChecklist(data: any): string {
  const { clientInfo, bestPractices, customItems } = data;

  return `# Exit Planning Best Practices Checklist
## ${clientInfo.companyName}

**Customized for:** ${clientInfo.ownerName}  
**Industry:** ${clientInfo.industry || "Not specified"}  
**Generated:** ${new Date().toLocaleDateString()}

---

## Priority Action Items

Based on your specific situation, here are the prioritized best practices to maximize your exit value:

### 🔴 Critical Priority (Immediate Action Required)

${bestPractices
  .filter((bp: BestPractice) => bp.selected && bp.priority === "high")
  .map(
    (bp: BestPractice, i: number) => `
#### ${i + 1}. ${bp.practice}
- **Impact:** ${bp.impact}
- **Timeline:** Begin immediately
- **Action Steps:**
  - [ ] Assess current state
  - [ ] Develop implementation plan
  - [ ] Assign responsible party
  - [ ] Set completion deadline
  - [ ] Track progress weekly
`,
  )
  .join("\n")}

### 🟡 High Priority (Complete within 6 months)

${bestPractices
  .filter((bp: BestPractice) => bp.selected && bp.priority === "medium")
  .map(
    (bp: BestPractice, i: number) => `
#### ${i + 1}. ${bp.practice}
- **Impact:** ${bp.impact}
- **Timeline:** Complete within 6 months
- **Action Steps:**
  - [ ] Schedule planning session
  - [ ] Allocate resources
  - [ ] Create project timeline
  - [ ] Monitor milestones
  - [ ] Report monthly progress
`,
  )
  .join("\n")}

### 🟢 Important (Complete within 12 months)

${bestPractices
  .filter((bp: BestPractice) => bp.selected && bp.priority === "low")
  .map(
    (bp: BestPractice, i: number) => `
#### ${i + 1}. ${bp.practice}
- **Impact:** ${bp.impact}
- **Timeline:** Complete within 12 months
`,
  )
  .join("\n")}

## Custom Action Items

Your specific requirements and opportunities:

${customItems
  .map(
    (item: string, i: number) => `
### Custom Item ${i + 1}
- **Description:** ${item}
- **Priority:** To be determined
- **Timeline:** To be assigned
- **Owner:** To be assigned
- **Status:** [ ] Not Started
`,
  )
  .join("\n")}

## Implementation Tracking

### Monthly Review Checklist
- [ ] Review all critical priority items
- [ ] Update completion percentages
- [ ] Identify blockers and issues
- [ ] Adjust timelines if needed
- [ ] Report to stakeholders

### Quarterly Milestones
- **Q1:** Complete all immediate actions
- **Q2:** 50% of high priority items done
- **Q3:** All high priority items complete
- **Q4:** Full implementation achieved

## Success Metrics

Track these indicators monthly:

1. **Overall Completion Rate**
   - Target: 25% per quarter
   - Current: 0%

2. **Value Impact Realized**
   - Target: $${((data.optimizedValuation - data.currentValuation) / 1000000).toFixed(1)}M
   - Current: $0M

3. **Exit Readiness Score**
   - Target: 95%
   - Current: ${data.readinessScore}%

## Resources & Support

### Recommended Advisors
- Exit Planning Specialist
- M&A Attorney
- Transaction CPA
- Investment Banker
- Wealth Manager

### Tools & Templates
- Process documentation templates
- Financial reporting formats
- Due diligence checklists
- Buyer presentation outlines
- Deal structure models

## Accountability Structure

**Executive Sponsor:** ${clientInfo.ownerName}  
**Project Manager:** [To be assigned]  
**Review Frequency:** Monthly  
**Reporting:** Dashboard + written updates

---

*This checklist is based on Julie Keyes' best practices from 100+ successful exits. Customize further based on your specific situation.*
`;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Generate all documents
    const documents = [];

    // Always generate these core documents
    documents.push({
      filename: `${data.clientInfo.companyName.replace(/\s+/g, "_")}_Executive_Exit_Summary.md`,
      content: generateExecutiveSummary(data),
      type: "summary",
    });

    documents.push({
      filename: `${data.clientInfo.companyName.replace(/\s+/g, "_")}_Valuation_Analysis.md`,
      content: generateValuationAnalysis(data),
      type: "valuation",
    });

    documents.push({
      filename: `${data.clientInfo.companyName.replace(/\s+/g, "_")}_Exit_Timeline.md`,
      content: generateExitTimeline(data),
      type: "timeline",
    });

    documents.push({
      filename: `${data.clientInfo.companyName.replace(/\s+/g, "_")}_Tax_Optimization_Plan.md`,
      content: generateTaxOptimization(data),
      type: "tax",
    });

    // Conditionally generate these documents
    if (
      data.bestPractices.some((bp: BestPractice) => bp.selected) ||
      data.customItems.length > 0
    ) {
      documents.push({
        filename: `${data.clientInfo.companyName.replace(/\s+/g, "_")}_Best_Practices_Checklist.md`,
        content: generateBestPracticesChecklist(data),
        type: "checklist",
      });
    }

    // Generate framework-specific documents
    const hasSuccessionFrameworks = data.frameworks.some(
      (f: Framework) => f.selected && f.category === "succession",
    );
    if (hasSuccessionFrameworks) {
      documents.push({
        filename: `${data.clientInfo.companyName.replace(/\s+/g, "_")}_Succession_Plan.md`,
        content: generateSuccessionPlan(data),
        type: "succession",
      });
    }

    return NextResponse.json({
      success: true,
      documents,
      summary: {
        totalDocuments: documents.length,
        clientName: data.clientInfo.companyName,
        currentValuation: data.currentValuation,
        optimizedValuation: data.optimizedValuation,
        potentialIncrease: data.optimizedValuation - data.currentValuation,
      },
    });
  } catch (error) {
    console.error("Document generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate documents" },
      { status: 500 },
    );
  }
}

// Additional document generator for succession planning
function generateSuccessionPlan(data: any): string {
  const { clientInfo, valuationFactors, frameworks } = data;
  const successionFrameworks = frameworks.filter(
    (f: Framework) => f.selected && f.category === "succession",
  );

  return `# Succession Planning Roadmap
## ${clientInfo.companyName}

**Prepared for:** ${clientInfo.ownerName}  
**Management Depth Score:** ${valuationFactors.managementDepth}%  
**Generated:** ${new Date().toLocaleDateString()}

---

## Executive Summary

Successful succession planning is critical for maximizing exit value and ensuring business continuity. Based on your current management depth score of ${valuationFactors.managementDepth}%, we've developed a comprehensive succession plan using Julie Keyes' proven frameworks.

## Selected Succession Frameworks

${successionFrameworks
  .map(
    (f: Framework) => `
### ${f.name}
${f.description}

**Implementation Timeline:** ${clientInfo.exitTimeframe === "1-2 years" ? "6-12 months" : "12-24 months"}  
**Priority Level:** ${valuationFactors.managementDepth < 60 ? "Critical" : "High"}
`,
  )
  .join("\n")}

## Current State Assessment

### Management Structure Analysis
- **Owner Dependency:** ${100 - valuationFactors.managementDepth}%
- **Key Person Risk:** ${valuationFactors.managementDepth < 50 ? "High" : valuationFactors.managementDepth < 70 ? "Medium" : "Low"}
- **Succession Readiness:** ${valuationFactors.managementDepth > 80 ? "Strong" : valuationFactors.managementDepth > 60 ? "Developing" : "Needs Attention"}

### Critical Roles Requiring Successors
1. Chief Executive Officer
2. Chief Financial Officer  
3. Head of Sales/Business Development
4. Head of Operations
5. Key Customer Relationship Managers

## Succession Development Plan

### Phase 1: Identify (Months 1-3)
- [ ] Map all critical roles and responsibilities
- [ ] Assess current talent pool
- [ ] Identify high-potential employees
- [ ] Determine external hiring needs
- [ ] Create succession planning matrix

### Phase 2: Develop (Months 4-12)
- [ ] Create individual development plans
- [ ] Implement mentoring programs
- [ ] Provide leadership training
- [ ] Assign stretch projects
- [ ] Regular performance reviews

### Phase 3: Transition (Months 13-24)
- [ ] Gradual responsibility transfer
- [ ] Document all procedures
- [ ] Test decision-making abilities
- [ ] Build customer relationships
- [ ] Establish clear reporting structure

## Succession Options Analysis

### Option 1: Internal Management Succession
**Viability:** ${valuationFactors.managementDepth > 70 ? "High" : "Medium"}
- Identify 2-3 internal candidates
- Develop over 18-24 months
- Gradual equity participation
- Retention bonuses

### Option 2: Family Succession
**Considerations:**
- Family member capabilities
- Interest and commitment levels
- Fair treatment of all stakeholders
- Professional development needs

### Option 3: External Hire
**When Appropriate:**
- No viable internal candidates
- Specific expertise needed
- Industry connections valuable
- Fresh perspective required

### Option 4: Management Buyout (MBO)
**Requirements:**
- Strong management team
- Financing capabilities
- Aligned interests
- Favorable terms

## Implementation Roadmap

### Immediate Actions (Next 30 days)
1. Announce succession planning initiative
2. Engage succession planning consultant
3. Begin talent assessments
4. Create communication plan
5. Set succession planning budget

### Key Milestones
- **Month 3:** All key roles mapped and assessed
- **Month 6:** Development plans in place
- **Month 12:** Successors identified for all critical roles
- **Month 18:** Active transition underway
- **Month 24:** Full succession readiness achieved

## Risk Mitigation Strategies

1. **Retention Risk**
   - Implement golden handcuffs
   - Offer equity participation
   - Create career pathways
   - Competitive compensation

2. **Knowledge Transfer**
   - Document all processes
   - Create training materials
   - Implement shadowing programs
   - Regular knowledge audits

3. **Cultural Continuity**
   - Define core values
   - Embed in hiring process
   - Regular culture surveys
   - Leadership modeling

## Success Metrics

Track monthly:
- Successor readiness scores
- Knowledge transfer completion
- Employee retention rates
- Customer confidence levels
- Operational continuity

## Financial Impact

**Current Impact of Limited Succession Planning:**
- Reduced valuation multiple: -20%
- Dollar impact: -$${((data.currentValuation * 0.2) / 1000000).toFixed(1)}M

**Projected Impact After Implementation:**
- Improved multiple: +15-20%
- Dollar impact: +$${((data.currentValuation * 0.15) / 1000000).toFixed(1)}M
- Risk reduction: Significant

---

*Based on Julie Keyes' succession planning frameworks with proven success in 100+ business transitions.*
`;
}
