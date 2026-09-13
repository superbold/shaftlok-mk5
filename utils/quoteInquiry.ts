export const emptyQuoteInquiry = () => ({
  name: '',
  email: '',
  phone: '',
  phone_region: 'us',
  address: '',
  yacht_type: '',
  yacht_name: '',
  displacement: '',
  max_hull_speed: '',
  shaft_diameter: '',
  prop_diameter: '',
  prop_pitch: '',
  num_blades: '',
  num_propellers: '',
  prop_type: '',
  engine: '',
  transmission: '',
  locking_system: '',
  cable_length: '',
  notes: ''
})

const blankToNull = (value: unknown) => {
  if (value == null) return null
  const text = String(value).trim()
  return text === '' ? null : text
}

export const inquiryFromQuote = (data: Record<string, unknown> | null | undefined) => {
  const form = emptyQuoteInquiry()
  if (!data) return form
  for (const key of Object.keys(form) as (keyof ReturnType<typeof emptyQuoteInquiry>)[]) {
    if (key === 'phone_region') {
      form.phone_region = (data.phone_region as string) || 'us'
      continue
    }
    form[key] = (data[key] as string) ?? ''
  }
  return form
}

export const inquiryColumnsFromForm = (form: Record<string, unknown>) => {
  const lockingSystem = blankToNull(form.locking_system)
  return {
    name: String(form.name || '').trim(),
    email: String(form.email || '').trim(),
    phone: blankToNull(form.phone),
    phone_region: (form.phone_region as string) || 'us',
    address: blankToNull(form.address),
    yacht_type: blankToNull(form.yacht_type),
    yacht_name: blankToNull(form.yacht_name),
    displacement: blankToNull(form.displacement),
    max_hull_speed: blankToNull(form.max_hull_speed),
    shaft_diameter: blankToNull(form.shaft_diameter),
    prop_diameter: blankToNull(form.prop_diameter),
    prop_pitch: blankToNull(form.prop_pitch),
    num_blades: blankToNull(form.num_blades),
    num_propellers: blankToNull(form.num_propellers),
    prop_type: blankToNull(form.prop_type),
    engine: blankToNull(form.engine),
    transmission: blankToNull(form.transmission),
    locking_system: lockingSystem,
    cable_length: lockingSystem === 'cable' ? blankToNull(form.cable_length) : null,
    notes: blankToNull(form.notes)
  }
}
