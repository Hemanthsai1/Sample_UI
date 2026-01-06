export interface Template {
  id: string;
  name: string;
  type: 'IND' | 'NDA' | 'ANDA' | 'DMF' | 'Photostability';
  content: string;
  placeholders: string[];
}

export interface DataSource {
  fieldName: string;
  value: string;
}

export const templates: Template[] = [
  {
    id: 'photostability',
    name: 'Protocol for Photostability',
    type: 'Photostability',
    placeholders: ['PRODUCT_NAME', 'STRENGTH', 'STORAGE_CONDITION', 'RESPONSIBILITY_TABLE'],
    content: `PROTOCOL FOR PHOTOSTABILITY TESTING

1. INTRODUCTION
This protocol describes the photostability testing requirements for [PRODUCT_NAME] ([STRENGTH]).

2. OBJECTIVE
To determine the photostability characteristics of [PRODUCT_NAME] under specified storage conditions.

3. STORAGE CONDITIONS
The product will be stored under the following conditions:
- Temperature: [STORAGE_CONDITION]
- Light exposure: As per ICH guidelines

4. RESPONSIBILITY
[RESPONSIBILITY_TABLE]

5. TESTING SCHEDULE
Testing will be conducted at 0, 1, 3, and 6 months.

6. ACCEPTANCE CRITERIA
The product must meet all specified quality attributes throughout the testing period.`
  },
  {
    id: 'ind',
    name: 'IND Application Template',
    type: 'IND',
    placeholders: ['PRODUCT_NAME', 'INDICATION', 'DOSAGE_FORM', 'ROUTE'],
    content: `INVESTIGATIONAL NEW DRUG (IND) APPLICATION

1. PRODUCT INFORMATION
Product Name: [PRODUCT_NAME]
Indication: [INDICATION]
Dosage Form: [DOSAGE_FORM]
Route of Administration: [ROUTE]

2. CLINICAL PROTOCOL
This IND application covers the investigation of [PRODUCT_NAME] for the treatment of [INDICATION].

3. MANUFACTURING INFORMATION
Detailed manufacturing information is provided in Section 3.2.

4. NON-CLINICAL STUDIES
All non-clinical studies have been completed and are summarized in Section 4.`
  },
  {
    id: 'nda',
    name: 'NDA Template',
    type: 'NDA',
    placeholders: ['PRODUCT_NAME', 'ACTIVE_INGREDIENT', 'STRENGTH', 'INDICATION'],
    content: `NEW DRUG APPLICATION (NDA)

1. EXECUTIVE SUMMARY
This NDA is submitted for [PRODUCT_NAME], containing [ACTIVE_INGREDIENT] at [STRENGTH] strength.

2. INDICATION
[PRODUCT_NAME] is indicated for [INDICATION].

3. CLINICAL EFFICACY
The clinical efficacy data demonstrates significant improvement in primary endpoints.

4. SAFETY PROFILE
The safety profile of [PRODUCT_NAME] is well-characterized through extensive clinical trials.`
  },
  {
    id: 'anda',
    name: 'ANDA Template',
    type: 'ANDA',
    placeholders: ['PRODUCT_NAME', 'REFERENCE_DRUG', 'BIOEQUIVALENCE'],
    content: `ABBREVIATED NEW DRUG APPLICATION (ANDA)

1. PRODUCT INFORMATION
Generic Product Name: [PRODUCT_NAME]
Reference Listed Drug: [REFERENCE_DRUG]

2. BIOEQUIVALENCE STUDIES
Bioequivalence has been demonstrated through [BIOEQUIVALENCE] studies.

3. COMPOSITION
The composition matches the reference drug in all active and inactive ingredients.

4. MANUFACTURING
Manufacturing processes are described in detail in Section 3.`
  },
  {
    id: 'dmf',
    name: 'DMF Template',
    type: 'DMF',
    placeholders: ['FACILITY_NAME', 'PRODUCT_TYPE', 'MANUFACTURING_PROCESS'],
    content: `DRUG MASTER FILE (DMF)

1. FACILITY INFORMATION
Facility Name: [FACILITY_NAME]
Location: [Address details]

2. PRODUCT INFORMATION
Product Type: [PRODUCT_TYPE]

3. MANUFACTURING PROCESS
[MANUFACTURING_PROCESS]

4. QUALITY CONTROL
All quality control measures are in place and documented.`
  }
];

export const defaultDataSource: DataSource[] = [
  { fieldName: 'PRODUCT_NAME', value: 'Paracetamol' },
  { fieldName: 'STRENGTH', value: '500' },
  { fieldName: 'STORAGE_CONDITION', value: '25°C ± 2°C / 60% ± 5% RH' },
  { fieldName: 'INDICATION', value: 'Pain and Fever' },
  { fieldName: 'DOSAGE_FORM', value: 'Tablet' },
  { fieldName: 'ROUTE', value: 'Oral' },
  { fieldName: 'ACTIVE_INGREDIENT', value: 'Paracetamol' },
  { fieldName: 'REFERENCE_DRUG', value: 'Tylenol' },
  { fieldName: 'BIOEQUIVALENCE', value: 'Pharmacokinetic' },
  { fieldName: 'FACILITY_NAME', value: 'Pharma Manufacturing Inc.' },
  { fieldName: 'PRODUCT_TYPE', value: 'Active Pharmaceutical Ingredient' },
  { fieldName: 'MANUFACTURING_PROCESS', value: 'Synthesis and Purification' },
  { fieldName: 'RESPONSIBILITY_TABLE', value: 'John Doe - Study Director\nJane Smith - Quality Assurance\nMike Johnson - Laboratory Manager' }
];

export function fillTemplate(template: Template, dataSource: DataSource[]): string {
  let filledContent = template.content;
  const dataMap = new Map(dataSource.map(d => [d.fieldName, d.value]));
  
  template.placeholders.forEach(placeholder => {
    const value = dataMap.get(placeholder) || `[${placeholder}]`;
    filledContent = filledContent.replace(new RegExp(`\\[${placeholder}\\]`, 'g'), value);
  });
  
  return filledContent;
}




