import React, { useState, useMemo } from 'react';
import { format, parseISO, isPast, addDays, differenceInDays } from 'date-fns';
import {
  Search, Plus, X, Home, Building2, ChevronRight, Filter,
  Calendar, Wrench, Camera, StickyNote, MapPin, Clock,
  Users, Ruler, AlertTriangle, Shield, ArrowLeft, Edit3, Save, Trash2
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  DEMO DATA                                                         */
/* ------------------------------------------------------------------ */
const DEMO_PROPERTIES = [
  {
    id: '1',
    address: '3842 Cedar Ravine Dr',
    city: 'Placerville',
    zip: '95667',
    customerName: 'Mike & Sarah Henderson',
    customerPhone: '(530) 555-0142',
    customerEmail: 'henderson.mike@email.com',
    propertyType: 'Single Family',
    dryerLocation: 'Interior Laundry',
    ventMaterial: 'Semi-Rigid',
    ventLength: 18,
    elbows90: 2,
    termination: 'Roof',
    accessNotes: 'Access through hallway closet. Dryer is stacked unit. Need step stool for roof cap.',
    nextDueDate: '2026-03-15',
    frequency: 'Annual',
    hasMembership: true,
    propertyNotes: 'Loyal customer since 2022. Always tips well. Two golden retrievers — lint buildup is heavier than normal.',
    photos: [
      { id: 'p1', label: 'Before — lint buildup', date: '2025-09-12', type: 'before' },
      { id: 'p2', label: 'After — clean vent run', date: '2025-09-12', type: 'after' },
    ],
    serviceHistory: [
      { id: 's1', date: '2025-09-12', service: 'Full Vent Cleaning', technician: 'Jake M.', price: 189, notes: 'Heavy lint buildup at first elbow. Replaced damaged flex section with rigid.' },
      { id: 's2', date: '2024-09-08', service: 'Full Vent Cleaning', technician: 'Jake M.', price: 169, notes: 'Standard cleaning. Vent in good condition.' },
      { id: 's3', date: '2023-08-22', service: 'Initial Inspection + Cleaning', technician: 'Carlos R.', price: 219, notes: 'First visit. Documented vent path. Recommended annual service.' },
    ],
  },
  {
    id: '2',
    address: '1205 Vine Hill Ct',
    city: 'El Dorado Hills',
    zip: '95762',
    customerName: 'Jennifer Whitfield',
    customerPhone: '(916) 555-0287',
    customerEmail: 'jwhitfield@email.com',
    propertyType: 'Single Family',
    dryerLocation: 'Garage',
    ventMaterial: 'Rigid Metal',
    ventLength: 8,
    elbows90: 1,
    termination: 'Wall',
    accessNotes: 'Dryer in garage, wall vent exits to side yard. Easy access.',
    nextDueDate: '2026-06-20',
    frequency: 'Annual',
    hasMembership: true,
    propertyNotes: 'New construction 2021. Short vent run, easy job. Customer prefers morning appointments.',
    photos: [
      { id: 'p3', label: 'Vent exterior cap', date: '2025-06-14', type: 'before' },
      { id: 'p4', label: 'Clean vent interior', date: '2025-06-14', type: 'after' },
    ],
    serviceHistory: [
      { id: 's4', date: '2025-06-14', service: 'Full Vent Cleaning', technician: 'Jake M.', price: 149, notes: 'Light lint. Short run, quick job.' },
      { id: 's5', date: '2024-06-10', service: 'Full Vent Cleaning', technician: 'Carlos R.', price: 149, notes: 'Routine cleaning. All clear.' },
    ],
  },
  {
    id: '3',
    address: '890 Mother Lode Dr, Unit B',
    city: 'Placerville',
    zip: '95667',
    customerName: 'Robert Chang',
    customerPhone: '(530) 555-0391',
    customerEmail: 'rchang88@email.com',
    propertyType: 'Townhouse',
    dryerLocation: 'Interior Laundry',
    ventMaterial: 'Flex',
    ventLength: 25,
    elbows90: 3,
    termination: 'Roof',
    accessNotes: 'Shared wall with Unit A. Must access roof from rear. HOA requires 48hr notice for roof work.',
    nextDueDate: '2026-01-10',
    frequency: 'Semi-Annual',
    hasMembership: false,
    propertyNotes: 'Long flex vent with multiple bends — recommend upgrading to semi-rigid. HOA contact: Susan at (530) 555-0800.',
    photos: [
      { id: 'p5', label: 'Crushed flex section', date: '2025-07-10', type: 'before' },
      { id: 'p6', label: 'After cleaning', date: '2025-07-10', type: 'after' },
    ],
    serviceHistory: [
      { id: 's6', date: '2025-07-10', service: 'Full Vent Cleaning', technician: 'Carlos R.', price: 209, notes: 'Flex vent partially crushed behind dryer. Cleaned but recommended replacement.' },
      { id: 's7', date: '2025-01-15', service: 'Full Vent Cleaning', technician: 'Jake M.', price: 199, notes: 'Semi-annual cleaning. Moderate buildup due to long run.' },
      { id: 's8', date: '2024-07-08', service: 'Initial Inspection + Cleaning', technician: 'Carlos R.', price: 229, notes: 'First visit. Very long vent path with 3 elbows. Needs semi-annual.' },
    ],
  },
  {
    id: '4',
    address: '2617 Cameron Park Dr',
    city: 'Cameron Park',
    zip: '95682',
    customerName: 'Lisa & Tom Garrett',
    customerPhone: '(530) 555-0518',
    customerEmail: 'garrettfamily@email.com',
    propertyType: 'Single Family',
    dryerLocation: 'Basement',
    ventMaterial: 'Rigid Metal',
    ventLength: 32,
    elbows90: 4,
    termination: 'Roof',
    accessNotes: 'Dryer in basement, vent runs up through two floors to roof. Need two techs for full cleaning. Ladder required for roof cap.',
    nextDueDate: '2025-12-01',
    frequency: 'Semi-Annual',
    hasMembership: true,
    propertyNotes: 'Challenging job — long vertical run. Always book 2-hour slot. Family of 6, very heavy dryer usage.',
    photos: [
      { id: 'p7', label: 'Basement vent connection', date: '2025-11-28', type: 'before' },
      { id: 'p8', label: 'Roof termination cap', date: '2025-11-28', type: 'after' },
    ],
    serviceHistory: [
      { id: 's9', date: '2025-11-28', service: 'Full Vent Cleaning', technician: 'Jake M.', price: 289, notes: '2-tech job. Heavy buildup at elbows. Cleared bird nest from roof cap.' },
      { id: 's10', date: '2025-05-20', service: 'Full Vent Cleaning', technician: 'Carlos R.', price: 279, notes: 'Semi-annual clean. Lint trap at elbow 3 was packed. Recommended lint alarm.' },
      { id: 's11', date: '2024-11-15', service: 'Initial Inspection + Cleaning', technician: 'Jake M.', price: 319, notes: 'First visit. Documented complex vent path. Installed booster fan recommendation.' },
    ],
  },
  {
    id: '5',
    address: '4501 Green Valley Rd',
    city: 'El Dorado Hills',
    zip: '95762',
    customerName: 'Priya Patel',
    customerPhone: '(916) 555-0645',
    customerEmail: 'priya.patel@email.com',
    propertyType: 'Single Family',
    dryerLocation: 'Interior Laundry',
    ventMaterial: 'Semi-Rigid',
    ventLength: 14,
    elbows90: 2,
    termination: 'Wall',
    accessNotes: 'Laundry room on first floor near kitchen. Wall vent exits to backyard. Dog in yard — call ahead.',
    nextDueDate: '2026-08-05',
    frequency: 'Annual',
    hasMembership: false,
    propertyNotes: 'Referred by Jennifer Whitfield. Straightforward job. Prefers Friday appointments.',
    photos: [
      { id: 'p9', label: 'Wall vent exterior', date: '2025-08-02', type: 'before' },
      { id: 'p10', label: 'Clean interior run', date: '2025-08-02', type: 'after' },
    ],
    serviceHistory: [
      { id: 's12', date: '2025-08-02', service: 'Full Vent Cleaning', technician: 'Jake M.', price: 169, notes: 'Standard cleaning. Good condition overall.' },
      { id: 's13', date: '2024-07-28', service: 'Initial Inspection + Cleaning', technician: 'Carlos R.', price: 199, notes: 'First visit. Moderate lint. Documented and cleaned.' },
    ],
  },
  {
    id: '6',
    address: '780 Main St, Suite 4',
    city: 'Placerville',
    zip: '95667',
    customerName: 'Gold Country Laundromat',
    customerPhone: '(530) 555-0773',
    customerEmail: 'manager@goldcountrylaundry.com',
    propertyType: 'Commercial',
    dryerLocation: 'Interior Laundry',
    ventMaterial: 'Rigid Metal',
    ventLength: 45,
    elbows90: 3,
    termination: 'Roof',
    accessNotes: '12 commercial dryers. Must schedule after hours (close at 9pm). Roof access from rear ladder. Bring extra bags.',
    nextDueDate: '2026-04-01',
    frequency: 'Semi-Annual',
    hasMembership: true,
    propertyNotes: 'Commercial account — 12 dryer vents. Quarterly inspection recommended. Contact manager Dave (530) 555-0774.',
    photos: [
      { id: 'p11', label: 'Commercial vent manifold', date: '2025-10-05', type: 'before' },
      { id: 'p12', label: 'After full cleaning', date: '2025-10-05', type: 'after' },
    ],
    serviceHistory: [
      { id: 's14', date: '2025-10-05', service: 'Commercial Multi-Unit Cleaning', technician: 'Jake M. + Carlos R.', price: 1189, notes: '12 vents cleaned. Units 4 and 7 had significant buildup. Replaced damaged cap on unit 7.' },
      { id: 's15', date: '2025-04-02', service: 'Commercial Multi-Unit Cleaning', technician: 'Jake M. + Carlos R.', price: 1149, notes: 'Semi-annual service. All units cleaned. Good condition.' },
      { id: 's16', date: '2024-10-01', service: 'Commercial Inspection + Cleaning', technician: 'Carlos R.', price: 1289, notes: 'Initial commercial assessment. Documented all 12 vent paths. Full cleaning performed.' },
    ],
  },
  {
    id: '7',
    address: '1933 Stonebriar Way',
    city: 'El Dorado Hills',
    zip: '95762',
    customerName: 'David & Karen Müller',
    customerPhone: '(916) 555-0829',
    customerEmail: 'dkmuller@email.com',
    propertyType: 'Single Family',
    dryerLocation: 'Interior Laundry',
    ventMaterial: 'Flex',
    ventLength: 22,
    elbows90: 3,
    termination: 'Roof',
    accessNotes: 'Second floor laundry. Vent runs through attic. Need to move storage boxes in attic to access vent path.',
    nextDueDate: '2026-02-18',
    frequency: 'Annual',
    hasMembership: false,
    propertyNotes: 'Flex vent through attic is kinked in two spots. Quoted upgrade to rigid — customer considering. Follow up in spring.',
    photos: [
      { id: 'p13', label: 'Kinked flex in attic', date: '2025-02-15', type: 'before' },
      { id: 'p14', label: 'After cleaning', date: '2025-02-15', type: 'after' },
    ],
    serviceHistory: [
      { id: 's17', date: '2025-02-15', service: 'Full Vent Cleaning', technician: 'Carlos R.', price: 199, notes: 'Flex vent kinked in attic. Cleaned but efficiency reduced. Quoted $450 for rigid upgrade.' },
      { id: 's18', date: '2024-02-20', service: 'Full Vent Cleaning', technician: 'Jake M.', price: 189, notes: 'Moderate buildup. Noted kinking issue, first recommendation for upgrade.' },
    ],
  },
  {
    id: '8',
    address: '562 Country Club Dr, Unit 12',
    city: 'Cameron Park',
    zip: '95682',
    customerName: 'Margaret Townsend',
    customerPhone: '(530) 555-0956',
    customerEmail: 'mtownsend@email.com',
    propertyType: 'Condo',
    dryerLocation: 'Interior Laundry',
    ventMaterial: 'Semi-Rigid',
    ventLength: 12,
    elbows90: 1,
    termination: 'Wall',
    accessNotes: 'Ground floor condo. Laundry closet in hallway. Wall vent to patio area. Easy access.',
    nextDueDate: '2026-05-10',
    frequency: 'Annual',
    hasMembership: true,
    propertyNotes: 'Elderly customer — be patient and explain everything. Daughter Angela is emergency contact (530) 555-0957.',
    photos: [
      { id: 'p15', label: 'Patio wall vent', date: '2025-05-08', type: 'before' },
      { id: 'p16', label: 'Clean connection', date: '2025-05-08', type: 'after' },
    ],
    serviceHistory: [
      { id: 's19', date: '2025-05-08', service: 'Full Vent Cleaning', technician: 'Jake M.', price: 149, notes: 'Short run, light lint. Checked smoke detector while there (customer request).' },
      { id: 's20', date: '2024-05-12', service: 'Full Vent Cleaning', technician: 'Carlos R.', price: 149, notes: 'Routine cleaning. Good condition.' },
    ],
  },
  {
    id: '9',
    address: '3100 Palmer Dr, Bldg C',
    city: 'Cameron Park',
    zip: '95682',
    customerName: 'Serrano Village Apartments',
    customerPhone: '(530) 555-1042',
    customerEmail: 'maintenance@serranovillage.com',
    propertyType: 'Multi-Unit',
    dryerLocation: 'Interior Laundry',
    ventMaterial: 'Rigid Metal',
    ventLength: 20,
    elbows90: 2,
    termination: 'Roof',
    accessNotes: 'Building C has 8 units. Maintenance manager provides master key. Roof access from interior stairwell. Schedule weekday mornings.',
    nextDueDate: '2026-04-15',
    frequency: 'Annual',
    hasMembership: true,
    propertyNotes: 'Apartment complex — Building C only (8 units). Buildings A & B serviced by competitor. Working on winning those buildings.',
    photos: [
      { id: 'p17', label: 'Unit 5 vent run', date: '2025-04-10', type: 'before' },
      { id: 'p18', label: 'Roof manifold after', date: '2025-04-10', type: 'after' },
    ],
    serviceHistory: [
      { id: 's21', date: '2025-04-10', service: 'Multi-Unit Cleaning (8 units)', technician: 'Jake M. + Carlos R.', price: 892, notes: 'All 8 units cleaned. Unit 3 had crushed transition piece — replaced. Unit 7 tenant absent, rescheduled.' },
      { id: 's22', date: '2024-04-05', service: 'Multi-Unit Cleaning (8 units)', technician: 'Carlos R.', price: 856, notes: 'Initial service for Building C. All units documented and cleaned.' },
    ],
  },
  {
    id: '10',
    address: '6280 Salmon Falls Rd',
    city: 'El Dorado Hills',
    zip: '95762',
    customerName: 'Brian & Amy Nakamura',
    customerPhone: '(916) 555-1188',
    customerEmail: 'bnakamura@email.com',
    propertyType: 'Single Family',
    dryerLocation: 'Garage',
    ventMaterial: 'Rigid Metal',
    ventLength: 10,
    elbows90: 1,
    termination: 'Wall',
    accessNotes: 'Dryer in garage. Short wall vent to side yard. Gate code: #4521.',
    nextDueDate: '2025-11-20',
    frequency: 'Annual',
    hasMembership: false,
    propertyNotes: 'Easy job, short run. Customer also has rental property at 412 Clarksville Rd — wants quote for that one too.',
    photos: [
      { id: 'p19', label: 'Garage dryer setup', date: '2024-11-18', type: 'before' },
      { id: 'p20', label: 'Clean wall vent', date: '2024-11-18', type: 'after' },
    ],
    serviceHistory: [
      { id: 's23', date: '2024-11-18', service: 'Full Vent Cleaning', technician: 'Jake M.', price: 149, notes: 'Quick job. Minimal lint. Discussed adding rental property to schedule.' },
      { id: 's24', date: '2023-11-10', service: 'Initial Inspection + Cleaning', technician: 'Carlos R.', price: 179, notes: 'First visit. Short run, good rigid metal install. Annual service sufficient.' },
    ],
  },
];

const PROPERTY_TYPES = ['Single Family', 'Townhouse', 'Condo', 'Multi-Unit', 'Commercial'];
const DRYER_LOCATIONS = ['Interior Laundry', 'Garage', 'Basement'];
const VENT_MATERIALS = ['Flex', 'Semi-Rigid', 'Rigid Metal'];
const TERMINATIONS = ['Roof', 'Wall'];
const FREQUENCIES = ['Annual', 'Semi-Annual'];

const today = new Date();

/* ------------------------------------------------------------------ */
/*  HELPER: blank property template                                   */
/* ------------------------------------------------------------------ */
function blankProperty() {
  return {
    id: crypto.randomUUID(),
    address: '', city: '', zip: '',
    customerName: '', customerPhone: '', customerEmail: '',
    propertyType: 'Single Family',
    dryerLocation: 'Interior Laundry',
    ventMaterial: 'Semi-Rigid',
    ventLength: 0, elbows90: 0,
    termination: 'Wall',
    accessNotes: '',
    nextDueDate: format(addDays(today, 365), 'yyyy-MM-dd'),
    frequency: 'Annual',
    hasMembership: false,
    propertyNotes: '',
    photos: [],
    serviceHistory: [],
  };
}

/* ================================================================== */
/*  APP                                                                */
/* ================================================================== */
export default function App() {
  const [properties, setProperties] = useState(DEMO_PROPERTIES);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [filterMembership, setFilterMembership] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [detailTab, setDetailTab] = useState('specs');

  /* derived ------------------------------------------------------- */
  const filtered = useMemo(() => {
    let list = properties;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.address.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q)
      );
    }
    if (filterType !== 'All') list = list.filter((p) => p.propertyType === filterType);
    if (filterOverdue) list = list.filter((p) => isPast(parseISO(p.nextDueDate)));
    if (filterMembership) list = list.filter((p) => p.hasMembership);
    return list;
  }, [properties, search, filterType, filterOverdue, filterMembership]);

  const selected = properties.find((p) => p.id === selectedId) || null;

  const kpis = useMemo(() => {
    const total = properties.length;
    const overdue = properties.filter((p) => isPast(parseISO(p.nextDueDate))).length;
    const memberships = properties.filter((p) => p.hasMembership).length;
    const avgVent = properties.length
      ? Math.round(properties.reduce((s, p) => s + p.ventLength, 0) / properties.length)
      : 0;
    return { total, overdue, memberships, avgVent };
  }, [properties]);

  /* callbacks ----------------------------------------------------- */
  function addProperty(p) {
    setProperties((prev) => [p, ...prev]);
    setShowNewModal(false);
  }

  function updateProperty(updated) {
    setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  function deleteProperty(id) {
    if (!confirm('Delete this property permanently?')) return;
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setSelectedId(null);
  }

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                          */
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-navy-700 text-white px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🥋</span> Property Profile Manager
          </h1>
          <p className="text-navy-200 text-xs sm:text-sm mt-0.5">The Dojo — Dryer Vent Services</p>
        </div>
        <span className="badge-blue text-xs hidden sm:inline-flex">Widget 7 of 7</span>
      </header>

      {/* KPI BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 sm:px-6 py-4">
        <KpiCard icon={<Home size={18} />} label="Total Properties" value={kpis.total} color="text-dojo-600" />
        <KpiCard icon={<AlertTriangle size={18} />} label="Due for Service" value={kpis.overdue} color="text-red-600" />
        <KpiCard icon={<Shield size={18} />} label="Active Memberships" value={kpis.memberships} color="text-green-600" />
        <KpiCard icon={<Ruler size={18} />} label="Avg Vent Length" value={`${kpis.avgVent} ft`} color="text-amber-600" />
      </div>

      {/* TOOLBAR */}
      <div className="px-4 sm:px-6 pb-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            className="input pl-9"
            placeholder="Search by address or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} /> Filters
          </button>
          <button className="btn-primary" onClick={() => setShowNewModal(true)}>
            <Plus size={16} /> New Property
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      {showFilters && (
        <div className="px-4 sm:px-6 pb-3 flex flex-wrap gap-3 items-end">
          <div>
            <label className="label">Property Type</label>
            <select className="select w-40" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option>All</option>
              {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={filterOverdue} onChange={(e) => setFilterOverdue(e.target.checked)} className="rounded border-gray-300 text-dojo-600 focus:ring-dojo-400" />
            Overdue for Service
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={filterMembership} onChange={(e) => setFilterMembership(e.target.checked)} className="rounded border-gray-300 text-dojo-600 focus:ring-dojo-400" />
            Has Membership
          </label>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 px-4 sm:px-6 pb-6 relative">
        {/* PROPERTY LIST */}
        <div className={`grid gap-3 ${selected ? 'hidden lg:grid' : 'grid'} sm:grid-cols-2 xl:grid-cols-3`}>
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-500">
              <Home size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No properties found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
          {filtered.map((p) => {
            const overdue = isPast(parseISO(p.nextDueDate));
            return (
              <button
                key={p.id}
                onClick={() => { setSelectedId(p.id); setDetailTab('specs'); }}
                className="card p-4 text-left w-full hover:ring-2 hover:ring-dojo-400 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{p.address}</p>
                    <p className="text-xs text-gray-500">{p.city}, CA {p.zip}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 mt-1 shrink-0" />
                </div>
                <p className="text-sm text-gray-700 mt-2">{p.customerName}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="badge-gray">{p.propertyType}</span>
                  {p.hasMembership && <span className="badge-green">Member</span>}
                  {overdue && <span className="badge-red">Overdue</span>}
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>Last: {p.serviceHistory.length ? format(parseISO(p.serviceHistory[0].date), 'MMM d, yyyy') : '—'}</span>
                  <span>Next: {format(parseISO(p.nextDueDate), 'MMM d, yyyy')}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{p.serviceHistory.length} service{p.serviceHistory.length !== 1 ? 's' : ''} on file</div>
              </button>
            );
          })}
        </div>

        {/* DETAIL SLIDE-IN */}
        {selected && (
          <DetailPanel
            property={selected}
            tab={detailTab}
            setTab={setDetailTab}
            onClose={() => setSelectedId(null)}
            onUpdate={updateProperty}
            onDelete={() => deleteProperty(selected.id)}
          />
        )}
      </div>

      {/* NEW PROPERTY MODAL */}
      {showNewModal && <NewPropertyModal onSave={addProperty} onClose={() => setShowNewModal(false)} />}
    </div>
  );
}

/* ================================================================== */
/*  KPI CARD                                                           */
/* ================================================================== */
function KpiCard({ icon, label, value, color }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`${color} shrink-0`}>{icon}</div>
      <div>
        <p className="text-xl font-bold leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  DETAIL PANEL                                                       */
/* ================================================================== */
function DetailPanel({ property: p, tab, setTab, onClose, onUpdate, onDelete }) {
  const [editNotes, setEditNotes] = useState(false);
  const [notes, setNotes] = useState(p.propertyNotes);
  const overdue = isPast(parseISO(p.nextDueDate));
  const daysDiff = differenceInDays(parseISO(p.nextDueDate), today);

  function saveNotes() {
    onUpdate({ ...p, propertyNotes: notes });
    setEditNotes(false);
  }

  const tabs = [
    { key: 'specs', label: 'Specs', icon: <Wrench size={14} /> },
    { key: 'history', label: 'History', icon: <Clock size={14} /> },
    { key: 'photos', label: 'Photos', icon: <Camera size={14} /> },
    { key: 'schedule', label: 'Schedule', icon: <Calendar size={14} /> },
    { key: 'notes', label: 'Notes', icon: <StickyNote size={14} /> },
  ];

  return (
    <div className="fixed inset-0 z-30 flex justify-end">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* panel */}
      <div className="relative w-full max-w-xl bg-white shadow-2xl overflow-y-auto animate-slide-in">
        {/* panel header */}
        <div className="sticky top-0 bg-navy-700 text-white px-5 py-4 z-10">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="hover:bg-white/10 rounded p-1 transition-colors lg:hidden">
              <ArrowLeft size={20} />
            </button>
            <button onClick={onClose} className="hover:bg-white/10 rounded p-1 transition-colors hidden lg:block">
              <X size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{p.address}</p>
              <p className="text-navy-200 text-xs">{p.city}, CA {p.zip}</p>
            </div>
            <button onClick={onDelete} className="hover:bg-red-500/20 rounded p-1.5 transition-colors" title="Delete property">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="badge-blue">{p.propertyType}</span>
            {p.hasMembership && <span className="badge-green">Member</span>}
            {overdue ? (
              <span className="badge-red">Overdue by {Math.abs(daysDiff)} days</span>
            ) : (
              <span className="badge-gray">Due in {daysDiff} days</span>
            )}
          </div>
          <p className="text-sm mt-2">{p.customerName}</p>
          <p className="text-navy-300 text-xs">{p.customerPhone} &middot; {p.customerEmail}</p>
        </div>

        {/* tabs */}
        <div className="flex border-b overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-dojo-600 text-dojo-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* tab content */}
        <div className="p-5">
          {tab === 'specs' && <SpecsTab p={p} />}
          {tab === 'history' && <HistoryTab p={p} />}
          {tab === 'photos' && <PhotosTab p={p} />}
          {tab === 'schedule' && <ScheduleTab p={p} onUpdate={onUpdate} />}
          {tab === 'notes' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Property Notes</h3>
                {editNotes ? (
                  <button className="btn-primary text-xs py-1" onClick={saveNotes}><Save size={14} /> Save</button>
                ) : (
                  <button className="btn-secondary text-xs py-1" onClick={() => setEditNotes(true)}><Edit3 size={14} /> Edit</button>
                )}
              </div>
              {editNotes ? (
                <textarea
                  className="input min-h-[160px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              ) : (
                <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border">
                  {p.propertyNotes || 'No notes yet.'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slideIn .25s ease-out; }
      `}</style>
    </div>
  );
}

/* ================================================================== */
/*  TAB: SPECS                                                         */
/* ================================================================== */
function SpecsTab({ p }) {
  const rows = [
    ['Property Type', p.propertyType],
    ['Dryer Location', p.dryerLocation],
    ['Vent Material', p.ventMaterial],
    ['Vent Length', `${p.ventLength} ft`],
    ['90-Degree Elbows', p.elbows90],
    ['Termination', p.termination],
  ];
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-sm mb-3">Property Specifications</h3>
        <div className="grid grid-cols-2 gap-3">
          {rows.map(([label, val]) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3 border">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-medium text-sm mt-0.5">{val}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-2">Access Notes</h3>
        <p className="text-sm text-gray-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          {p.accessNotes || 'No access notes.'}
        </p>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  TAB: HISTORY                                                       */
/* ================================================================== */
function HistoryTab({ p }) {
  if (p.serviceHistory.length === 0) {
    return <p className="text-sm text-gray-500 py-8 text-center">No service history yet.</p>;
  }
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Service History ({p.serviceHistory.length})</h3>
      {p.serviceHistory.map((s) => (
        <div key={s.id} className="border rounded-lg p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-sm">{s.service}</p>
              <p className="text-xs text-gray-500 mt-0.5">{format(parseISO(s.date), 'MMMM d, yyyy')}</p>
            </div>
            <span className="font-semibold text-sm text-green-700">${s.price}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Tech: {s.technician}</p>
          <p className="text-sm text-gray-700 mt-2 bg-gray-50 rounded p-2">{s.notes}</p>
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  TAB: PHOTOS                                                        */
/* ================================================================== */
function PhotosTab({ p }) {
  if (p.photos.length === 0) {
    return <p className="text-sm text-gray-500 py-8 text-center">No photos on file.</p>;
  }
  return (
    <div>
      <h3 className="font-semibold text-sm mb-3">Photo Gallery</h3>
      <div className="grid grid-cols-2 gap-3">
        {p.photos.map((ph) => (
          <div key={ph.id} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-200 h-32 flex items-center justify-center">
              <Camera size={28} className="text-gray-400" />
            </div>
            <div className="p-2">
              <span className={`text-[10px] font-bold uppercase tracking-wide ${ph.type === 'before' ? 'text-red-600' : 'text-green-600'}`}>
                {ph.type}
              </span>
              <p className="text-xs text-gray-700 mt-0.5">{ph.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{format(parseISO(ph.date), 'MMM d, yyyy')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  TAB: SCHEDULE                                                      */
/* ================================================================== */
function ScheduleTab({ p, onUpdate }) {
  const overdue = isPast(parseISO(p.nextDueDate));

  function updateField(field, value) {
    onUpdate({ ...p, [field]: value });
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold text-sm mb-3">Maintenance Schedule</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 border">
            <p className="text-xs text-gray-500">Next Due Date</p>
            <input
              type="date"
              className="input mt-1 text-sm"
              value={p.nextDueDate}
              onChange={(e) => updateField('nextDueDate', e.target.value)}
            />
            {overdue && <p className="text-xs text-red-600 mt-1 font-medium">OVERDUE</p>}
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border">
            <p className="text-xs text-gray-500">Frequency</p>
            <select className="select mt-1 text-sm" value={p.frequency} onChange={(e) => updateField('frequency', e.target.value)}>
              {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 border">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Membership Status</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {p.hasMembership ? 'Active maintenance membership' : 'No active membership'}
            </p>
          </div>
          <button
            onClick={() => updateField('hasMembership', !p.hasMembership)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              p.hasMembership ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                p.hasMembership ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      {p.serviceHistory.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-2">Last Service</h3>
          <p className="text-sm text-gray-700">
            {format(parseISO(p.serviceHistory[0].date), 'MMMM d, yyyy')} — {p.serviceHistory[0].service}
          </p>
          <p className="text-xs text-gray-500 mt-1">by {p.serviceHistory[0].technician}</p>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  NEW PROPERTY MODAL                                                 */
/* ================================================================== */
function NewPropertyModal({ onSave, onClose }) {
  const [form, setForm] = useState(blankProperty());

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }
  function setNum(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: Number(e.target.value) || 0 }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.address.trim() || !form.customerName.trim()) {
      alert('Address and Customer Name are required.');
      return;
    }
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mt-8 mb-8"
      >
        {/* modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-bold text-lg">New Property</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* customer */}
          <fieldset className="space-y-3">
            <legend className="font-semibold text-sm text-gray-800 mb-1">Customer Info</legend>
            <div>
              <label className="label">Customer Name *</label>
              <input className="input" value={form.customerName} onChange={set('customerName')} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Phone</label>
                <input className="input" value={form.customerPhone} onChange={set('customerPhone')} />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" value={form.customerEmail} onChange={set('customerEmail')} />
              </div>
            </div>
          </fieldset>

          {/* address */}
          <fieldset className="space-y-3">
            <legend className="font-semibold text-sm text-gray-800 mb-1">Address</legend>
            <div>
              <label className="label">Street Address *</label>
              <input className="input" value={form.address} onChange={set('address')} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">City</label>
                <input className="input" value={form.city} onChange={set('city')} />
              </div>
              <div>
                <label className="label">ZIP</label>
                <input className="input" value={form.zip} onChange={set('zip')} />
              </div>
            </div>
          </fieldset>

          {/* vent specs */}
          <fieldset className="space-y-3">
            <legend className="font-semibold text-sm text-gray-800 mb-1">Vent Specifications</legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Property Type</label>
                <select className="select" value={form.propertyType} onChange={set('propertyType')}>
                  {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Dryer Location</label>
                <select className="select" value={form.dryerLocation} onChange={set('dryerLocation')}>
                  {DRYER_LOCATIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Vent Material</label>
                <select className="select" value={form.ventMaterial} onChange={set('ventMaterial')}>
                  {VENT_MATERIALS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Termination</label>
                <select className="select" value={form.termination} onChange={set('termination')}>
                  {TERMINATIONS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Vent Length (ft)</label>
                <input className="input" type="number" min="0" value={form.ventLength} onChange={setNum('ventLength')} />
              </div>
              <div>
                <label className="label">90-Degree Elbows</label>
                <input className="input" type="number" min="0" value={form.elbows90} onChange={setNum('elbows90')} />
              </div>
            </div>
          </fieldset>

          {/* scheduling */}
          <fieldset className="space-y-3">
            <legend className="font-semibold text-sm text-gray-800 mb-1">Scheduling</legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Next Due Date</label>
                <input className="input" type="date" value={form.nextDueDate} onChange={set('nextDueDate')} />
              </div>
              <div>
                <label className="label">Frequency</label>
                <select className="select" value={form.frequency} onChange={set('frequency')}>
                  {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.hasMembership}
                onChange={(e) => setForm((prev) => ({ ...prev, hasMembership: e.target.checked }))}
                className="rounded border-gray-300 text-dojo-600 focus:ring-dojo-400"
              />
              Active Membership
            </label>
          </fieldset>

          {/* notes */}
          <div>
            <label className="label">Access Notes</label>
            <textarea className="input min-h-[80px]" value={form.accessNotes} onChange={set('accessNotes')} />
          </div>
          <div>
            <label className="label">Property Notes</label>
            <textarea className="input min-h-[80px]" value={form.propertyNotes} onChange={set('propertyNotes')} />
          </div>
        </div>

        {/* modal footer */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary"><Plus size={16} /> Add Property</button>
        </div>
      </form>
    </div>
  );
}
