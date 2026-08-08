interface QuoteItemWarning {
  title: string
  paragraphs: string[]
}

export const QUOTE_ITEM_WARNINGS: Record<string, QuoteItemWarning> = {
  'marine-control-cable': {
    title: 'Marine Control Cable',
    paragraphs: [
      "It's unnecessary to run the control cable to the helm station, since the Shaft Lok unit unlocks automatically — most cruising sailors mount it closer to the engine, inside the boat.",
      'To lock the unit, push the black palm knob on the Control Cable. Especially the first few times, it helps to feel the locking pin move into the cam on the black rotating disc — a shorter cable makes this easier to feel. The unit unlocks automatically once the engine is started and the transmission is put into gear.',
      "Treat the cable like a diesel fuel line: keep bends gentle, and allow a couple of extra inches of slack when measuring the run. A cable that's too short can't be altered once shipped, while a slightly longer one won't affect operation."
    ]
  },
  'simple-spring-locking-system': {
    title: 'Simple Spring Locking System (SSLS)',
    paragraphs: [
      'To lock the unit, push the black palm knob on the Simple Spring Locking System (SSLS). Especially the first few times, it helps to feel the locking pin move into the cam on the black rotating disc. The unit unlocks automatically once the engine is started and the transmission is put into gear.',
      'The SSLS, also in stock, replaces the control cable entirely and mounts directly to the top of the Shaft Lok unit — but requires engine room access each time you lock the unit.'
    ]
  }
}

export function getApplicableWarnings(lineItems: { product_slug: string }[]): QuoteItemWarning[] {
  const seen = new Set<string>()
  return lineItems
    .filter((item) => {
      if (seen.has(item.product_slug) || !QUOTE_ITEM_WARNINGS[item.product_slug]) return false
      seen.add(item.product_slug)
      return true
    })
    .map((item) => QUOTE_ITEM_WARNINGS[item.product_slug]!)
}
