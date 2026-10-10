import React, { useState, useEffect } from 'react'
import farmStorage from '../lib/farmStorage'
import toast from '../components/ui/Toast'
import Modal from '../components/ui/Modal'
import api from '../lib/api'

export default function SurveyorsManagementPage() {
  const [surveyors, setSurveyors] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Form State
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: 'surveyor123',
    contact_number: '',
    area_place: 'Salem & Coimbatore, Tamil Nadu',
    license_number: '',
    specialization: 'RTK GPS Boundary Survey & Digitization',
  })
  const [loading, setLoading] = useState(false)

  const loadSurveyors = () => {
    const list = farmStorage.getSurveyors()
    setSurveyors(list)
  }

  useEffect(() => {
    loadSurveyors()
  }, [])

  const handleOpenCreateModal = () => {
    const randomId = Math.floor(100 + Math.random() * 900)
    setForm({
      full_name: '',
      email: '',
      password: 'surveyor123',
      contact_number: '',
      area_place: 'Salem & Coimbatore, Tamil Nadu',
      license_number: `V2V-SURV-2026-${randomId}`,
      specialization: 'RTK GPS Boundary Survey & Digitization',
    })
    setShowCreateModal(true)
  }

  const handleCreateSurveyor = async (e) => {
    e.preventDefault()
    if (!form.full_name || !form.email || !form.password) {
      toast.error('Please fill in Name, Email, and Password.')
      return
    }

    setLoading(true)
    try {
      // 1. Save in local storage (instant offline-first storage)
      const created = farmStorage.createSurveyor({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        contact_number: form.contact_number,
        area_place: form.area_place,
        license_number: form.license_number,
        specialization: form.specialization,
      })

      // 2. Best-effort API synchronization with backend if available
      try {
        await api.post('/users/', {
          email: form.email,
          password: form.password,
          full_name: form.full_name,
          role: 'verifier',
        })
      } catch {
        // Backend not running in standalone mode; local storage has persisted the user
      }

      toast.success(`Surveyor "${form.full_name}" registered! Login: ${form.email} / ${form.password}`)
      setShowCreateModal(false)
      loadSurveyors()
    } catch (err) {
      toast.error('Failed to create surveyor.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSurveyor = (email) => {
    farmStorage.deleteSurveyor(email)
    toast.success('Surveyor account removed.')
    setDeleteConfirm(null)
    loadSurveyors()
  }

  const filteredSurveyors = surveyors.filter(s => {
    const q = search.toLowerCase()
    return (
      (s.full_name || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.area_place || '').toLowerCase().includes(q) ||
      (s.license_number || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* ── Top Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-v2v-deep dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50 text-xs font-bold mb-2">
            <span>🛡️</span>
            <span>Admin Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-v2v-deep dark:text-purple-300 tracking-tight">
            Field Surveyor Creation & Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Create field surveyor accounts, generate GIS login credentials, and assign regional field territories.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="btn-v2v-gradient text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold"
        >
          <span>➕</span>
          <span>Create New Surveyor</span>
        </button>
      </div>

      {/* ── Stats Summary Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-xs text-gray-500 dark:text-slate-400 uppercase font-semibold">Active Surveyors</div>
          <div className="text-2xl font-extrabold text-v2v-deep dark:text-purple-300 mt-1">{surveyors.length}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Cadastral Certified</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-gray-500 dark:text-slate-400 uppercase font-semibold">Operational Hubs</div>
          <div className="text-2xl font-extrabold text-v2v-deep dark:text-purple-300 mt-1">
            {new Set(surveyors.map(s => s.area_place || 'Tamil Nadu')).size}
          </div>
          <div className="text-[11px] text-v2v-secondary dark:text-purple-400 font-medium mt-0.5">Assigned Districts</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-gray-500 dark:text-slate-400 uppercase font-semibold">Field Spatial Access</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">RTK / GPS</div>
          <div className="text-[11px] text-gray-500 font-medium mt-0.5">Sub-Meter Precision</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-gray-500 dark:text-slate-400 uppercase font-semibold">Account Status</div>
          <div className="text-2xl font-extrabold text-v2v-deep dark:text-purple-300 mt-1">Active</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Live Credential Sync</div>
        </div>
      </div>

      {/* ── Search Toolbar ── */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-v2v-lavendergray dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search surveyor by name, email, territory, or license ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <span className="text-xs text-gray-500">
          Showing <strong>{filteredSurveyors.length}</strong> of {surveyors.length} surveyors
        </span>
      </div>

      {/* ── Surveyors Table ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-v2v-lavendergray dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-v2v-softwhite dark:bg-slate-800/80 border-b border-v2v-lavendergray dark:border-slate-700 text-v2v-deep dark:text-purple-300 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Surveyor Profile</th>
                <th className="py-3.5 px-4 font-bold">Login Email & Phone</th>
                <th className="py-3.5 px-4 font-bold">Assigned Territory</th>
                <th className="py-3.5 px-4 font-bold">Specialization</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredSurveyors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    <div className="text-4xl mb-2">🛡️</div>
                    <p className="font-semibold text-gray-600 dark:text-gray-300">No surveyors found.</p>
                    <p className="text-xs mt-1">Click "Create New Surveyor" to register a field surveyor.</p>
                  </td>
                </tr>
              ) : (
                filteredSurveyors.map((s, idx) => (
                  <tr key={s.id || s.email || idx} className="hover:bg-purple-50/40 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-v2v-deep to-purple-800 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                          {s.full_name?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <div>
                          <div className="font-bold text-v2v-deep dark:text-purple-200 text-sm">
                            {s.full_name}
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-v2v-deep dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            {s.license_number || `V2V-SURV-2026-${idx + 101}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        {s.email}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        📞 {s.contact_number || '+91 94431 00000'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-slate-700">
                        <span>📍</span>
                        <span>{s.area_place || 'Salem & Pollachi, Tamil Nadu'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {s.specialization || 'RTK GPS Cadastral Digitization'}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                        Verifier Role Privileges
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Active On Duty</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setDeleteConfirm(s)}
                        className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create Surveyor Modal ── */}
      {showCreateModal && (
        <Modal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="🛡️ Create New Field Surveyor Credentials"
        >
          <form onSubmit={handleCreateSurveyor} className="space-y-4 text-xs">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-xl border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200">
              <p className="font-semibold">
                This account will be created with <strong>Verifier & Surveyor</strong> role privileges, enabling full map drawing, precision line plotting, and cadastral boundary verification tools.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">1) Surveyor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">2) Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98401 23456"
                  value={form.contact_number}
                  onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">3) Login Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. surveyor.ramesh@v2vtech.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">4) Login Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Password (e.g. surveyor123)"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">5) Assigned Operational Territory / District *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salem & Pollachi, Tamil Nadu"
                  value={form.area_place}
                  onChange={(e) => setForm({ ...form, area_place: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">6) Surveyor License / Badge ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. V2V-SURV-2026-088"
                  value={form.license_number}
                  onChange={(e) => setForm({ ...form, license_number: e.target.value })}
                  className="input-field font-mono"
                />
              </div>
            </div>

            <div>
              <label className="label">7) Field Specialization</label>
              <select
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                className="input-field"
              >
                <option value="RTK GPS Boundary Survey & Digitization">RTK GPS Boundary Survey & Digitization</option>
                <option value="Cadastral Land Audit & Patta Verification">Cadastral Land Audit & Patta Verification</option>
                <option value="Precision Micro-Irrigation & Drone Survey">Precision Micro-Irrigation & Drone Survey</option>
                <option value="Soil Sampling & IoT Sensor Deployment">Soil Sampling & IoT Sensor Deployment</option>
              </select>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary text-xs py-2 px-4 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-v2v-gradient text-xs py-2 px-5 rounded-xl font-bold shadow-md"
              >
                {loading ? 'Creating Account…' : '✅ Issue Surveyor Credentials →'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <Modal
          open={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="⚠️ Confirm Removal of Surveyor Account"
        >
          <div className="space-y-4 text-xs">
            <p className="text-gray-600">
              Are you sure you want to deactivate and remove <strong>{deleteConfirm.full_name}</strong> ({deleteConfirm.email}) from the surveyor roster?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary text-xs py-2 px-4 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSurveyor(deleteConfirm.email)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
