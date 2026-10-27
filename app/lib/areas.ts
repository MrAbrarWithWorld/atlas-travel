// Service-area pages (/areas/<slug>). We work remotely by phone and video; these pages exist so
// owners in each city can see the offer in their own context. Facts here are geography and area codes only.
// No client names, results or addresses. Add a city only with real, city-specific content.

export type Area = {
  slug: string;
  name: string;
  region: string;
  areaCodes: string;
  districts: string[];
  fit: string[];
  localNote: string;
};

export const AREAS: Area[] = [
  {
    slug: 'toronto',
    name: 'Toronto',
    region: 'Toronto, Ontario',
    areaCodes: '416, 647 and 437',
    districts: ['Downtown', 'North York', 'Scarborough', 'Etobicoke', 'East York', 'York'],
    fit: ['Renovation, plumbing, HVAC and cleaning companies', 'Salons, barbers and clinics taking bookings', 'Realtors and bookkeepers handling new enquiries'],
    localNote:
      'Toronto owners often run from a van, a chair or a job site, so calls go unanswered for hours. We are based in Toronto, and setup is done by phone and video.',
  },
  {
    slug: 'mississauga',
    name: 'Mississauga',
    region: 'Mississauga, Peel Region, Ontario',
    areaCodes: '905, 289 and 365',
    districts: ['Port Credit', 'Streetsville', 'Meadowvale', 'Erin Mills', 'Cooksville', 'Malton'],
    fit: ['Contractors and home-service companies serving Peel Region', 'Restaurants and caterers taking orders and enquiries', 'Small agencies and freelancers with a few clients'],
    localNote:
      'Many Mississauga businesses cover Peel, Halton and Toronto at once, which means enquiries arrive from several area codes. A text-back that answers every number at once keeps those leads from drifting to the next company.',
  },
  {
    slug: 'brampton',
    name: 'Brampton',
    region: 'Brampton, Peel Region, Ontario',
    areaCodes: '905, 289 and 365',
    districts: ['Bramalea', 'Heart Lake', 'Springdale', 'Downtown Brampton', 'Mount Pleasant', 'Castlemore'],
    fit: ['Trades, landscaping and moving companies', 'Salons and beauty studios with walk-in and phone traffic', 'Bookkeepers and small accounting practices'],
    localNote:
      'If your customers speak more than one language, we can keep replies short and in your own wording. We can set up replies in your own wording and approve every message before it goes out, so your customers hear your voice.',
  },
  {
    slug: 'vaughan',
    name: 'Vaughan',
    region: 'Vaughan, York Region, Ontario',
    areaCodes: '905, 289 and 365',
    districts: ['Woodbridge', 'Maple', 'Concord', 'Thornhill', 'Kleinburg', 'Vellore'],
    fit: ['Renovation, roofing and landscaping companies', 'Realtors and mortgage-adjacent offices', 'Restaurants, banquet halls and event venues'],
    localNote:
      'Quote requests for renovation and event work can arrive after hours. A fast reply with a booking link keeps the conversation with you instead of the next company, which is what an instant reply and a follow-up you approve are for.',
  },
  {
    slug: 'markham',
    name: 'Markham',
    region: 'Markham, York Region, Ontario',
    areaCodes: '905, 289 and 365',
    districts: ['Unionville', 'Thornhill', 'Cornell', 'Milliken', 'Angus Glen', 'Markham Village'],
    fit: ['Clinics, tutoring and professional-service offices', 'Small agencies and consultants', 'Home-service companies across York Region'],
    localNote:
      'Markham has many small professional practices that rely on enquiry forms and email. We start with a free audit that shows how quickly those enquiries are answered today, before you spend anything.',
  },
];

export function getArea(slug: string) {
  return AREAS.find((a) => a.slug === slug);
}
