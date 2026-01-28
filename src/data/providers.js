// Demo providers with real NPIs for credential verification

export const providers = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    credentials: 'MD',
    specialty: 'Cardiology',
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
    name: 'Dr. Michael Johnson',
    credentials: 'DO',
    specialty: 'Internal Medicine',
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
      medicalSchool: 'Baylor College of Medicine'
    }
  },
  {
    id: 3,
    name: 'Jessica Williams',
    credentials: 'NP',
    specialty: 'Nurse Practitioner',
    npi: '1245319876',
    npiData: {
      npi: '1245319876',
      name: 'Jessica Williams',
      credentials: 'NP',
      taxonomy: 'Nurse Practitioner - Family',
      address: '789 Health Center Blvd, Dallas, TX 75201',
      phone: '(214) 555-0300',
      status: 'Active'
    },
    licenseData: {
      state: 'TX',
      licenseNumber: 'NP54321',
      licenseStatus: 'Active',
      issueDate: '2019-03-10',
      expirationDate: '2027-03-31',
      disciplinaryActions: 'None',
      medicalSchool: 'University of Texas School of Nursing'
    }
  },
  {
    id: 4,
    name: 'Dr. Robert Anderson',
    credentials: 'MD',
    specialty: 'Emergency Medicine',
    npi: '1356782945',
    npiData: {
      npi: '1356782945',
      name: 'Robert Anderson',
      credentials: 'MD',
      taxonomy: 'Emergency Medicine',
      address: '321 Emergency Dr, San Antonio, TX 78205',
      phone: '(210) 555-0400',
      status: 'Active'
    },
    licenseData: {
      state: 'TX',
      licenseNumber: 'M67890',
      licenseStatus: 'Active',
      issueDate: '2012-08-15',
      expirationDate: '2026-08-31',
      disciplinaryActions: 'None',
      medicalSchool: 'Johns Hopkins School of Medicine'
    }
  }
];

// Demo mode simulated data for faster presentations
export const demoProviderData = {
  '1821089041': {
    npi: {
      npi: '1821089041',
      name: 'Sarah Chen',
      credentials: 'MD',
      taxonomy: 'Cardiology',
      address: '123 Medical Plaza, Austin, TX 78701',
      phone: '(512) 555-0100',
      status: 'Active'
    },
    license: {
      license_number: 'M12345',
      license_status: 'Active',
      issue_date: '2015-01-15',
      expiration_date: '2027-12-31',
      disciplinary_actions: 'None',
      medical_school: 'University of Texas Medical School'
    }
  },
  '1033226892': {
    npi: {
      npi: '1033226892',
      name: 'Michael Johnson',
      credentials: 'DO',
      taxonomy: 'Internal Medicine',
      address: '456 Healthcare Drive, Houston, TX 77002',
      phone: '(713) 555-0200',
      status: 'Active'
    },
    license: {
      license_number: 'DO9876',
      license_status: 'Active',
      issue_date: '2018-06-20',
      expiration_date: '2026-06-30',
      disciplinary_actions: 'None',
      medical_school: 'Baylor College of Medicine'
    }
  },
  '1245319876': {
    npi: {
      npi: '1245319876',
      name: 'Jessica Williams',
      credentials: 'NP',
      taxonomy: 'Nurse Practitioner - Family',
      address: '789 Health Center Blvd, Dallas, TX 75201',
      phone: '(214) 555-0300',
      status: 'Active'
    },
    license: {
      license_number: 'NP54321',
      license_status: 'Active',
      issue_date: '2019-03-10',
      expiration_date: '2027-03-31',
      disciplinary_actions: 'None',
      medical_school: 'University of Texas School of Nursing'
    }
  },
  '1356782945': {
    npi: {
      npi: '1356782945',
      name: 'Robert Anderson',
      credentials: 'MD',
      taxonomy: 'Emergency Medicine',
      address: '321 Emergency Dr, San Antonio, TX 78205',
      phone: '(210) 555-0400',
      status: 'Active'
    },
    license: {
      license_number: 'M67890',
      license_status: 'Active',
      issue_date: '2012-08-15',
      expiration_date: '2026-08-31',
      disciplinary_actions: 'None',
      medical_school: 'Johns Hopkins School of Medicine'
    }
  }
};
