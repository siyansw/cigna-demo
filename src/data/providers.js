// Demo providers with real NPIs for credential verification

export const providers = [
  {
    id: 1,
    name: 'Dr. Maria Rodriguez',
    credentials: 'MD',
    specialty: 'Family Medicine',
    npi: '1821089041',
    npiData: {
      npi: '1821089041',
      name: 'Maria Rodriguez',
      credentials: 'MD',
      taxonomy: 'Family Medicine',
      address: '123 Medical Plaza, Austin, TX 78701',
      phone: '(512) 555-0100',
      status: 'Active'
    },
    licenseData: {
      state: 'TX',
      licenseNumber: 'M12345',
      licenseStatus: 'Active',
      issueDate: '2015-01-15',
      expirationDate: '2027-12-31',
      disciplinaryActions: 'None',
      medicalSchool: 'University of Texas Medical School'
    }
  },
  {
    id: 2,
    name: 'David Kim',
    credentials: 'PA-C',
    specialty: 'Physician Assistant',
    npi: '1033226892',
    npiData: {
      npi: '1033226892',
      name: 'David Kim',
      credentials: 'PA-C',
      taxonomy: 'Physician Assistant',
      address: '456 Healthcare Drive, Houston, TX 77002',
      phone: '(713) 555-0200',
      status: 'Active'
    },
    licenseData: {
      state: 'TX',
      licenseNumber: 'PA9876',
      licenseStatus: 'Active',
      issueDate: '2018-06-20',
      expirationDate: '2026-06-30',
      disciplinaryActions: 'None',
      medicalSchool: 'Baylor PA Program'
    }
  }
];

// Demo mode simulated data for faster presentations
export const demoProviderData = {
  '1821089041': {
    npi: {
      npi: '1821089041',
      name: 'Maria Rodriguez',
      credentials: 'MD',
      taxonomy: 'Family Medicine',
      address: '123 Medical Plaza, Austin, TX 78701',
      phone: '(512) 555-0100',
      status: 'Active'
    },
    license: {
      licenseNumber: 'M12345',
      licenseStatus: 'Active',
      issueDate: '2015-01-15',
      expirationDate: '2027-12-31',
      disciplinaryActions: 'None',
      medicalSchool: 'University of Texas Medical School'
    }
  },
  '1033226892': {
    npi: {
      npi: '1033226892',
      name: 'David Kim',
      credentials: 'PA-C',
      taxonomy: 'Physician Assistant',
      address: '456 Healthcare Drive, Houston, TX 77002',
      phone: '(713) 555-0200',
      status: 'Active'
    },
    license: {
      licenseNumber: 'PA9876',
      licenseStatus: 'Active',
      issueDate: '2018-06-20',
      expirationDate: '2026-06-30',
      disciplinaryActions: 'None',
      medicalSchool: 'Baylor PA Program'
    }
  }
};
