import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Button
export function Button({ children, variant = 'primary', size = 'md', className = '', loading, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-4 focus:ring-brand-primary/10';
  const variants = {
    primary:  'border border-transparent bg-[linear-gradient(135deg,#7D53F6_0%,#9F74F7_100%)] text-white shadow-[0_18px_40px_rgba(125,83,246,0.24)] hover:-translate-y-0.5 hover:shadow-[0_24px_54px_rgba(125,83,246,0.28)]',
    outline:  'border border-brand-border/80 bg-white/88 text-brand-primary shadow-[0_10px_28px_rgba(145,158,171,0.10)] hover:-translate-y-0.5 hover:border-brand-primary/30 hover:bg-brand-surface/70',
    ghost:    'border border-transparent text-brand-muted hover:bg-white/70 hover:text-brand-text',
    danger:   'bg-brand-red text-white hover:-translate-y-0.5',
    success:  'bg-brand-green text-white hover:-translate-y-0.5',
    skyblue:  'bg-brand-skyblue text-white hover:-translate-y-0.5',
  };
  const sizes = { sm: 'h-10 px-4 text-xs', md: 'h-10 px-5 text-sm', lg: 'h-14 px-6 text-base' };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

// Badge
export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:  'bg-brand-surface text-brand-muted',
    success:  'bg-green-50 text-brand-green',
    warning:  'bg-amber-50 text-amber-700',
    danger:   'bg-red-50 text-brand-red',
    info:     'bg-blue-50 text-brand-skyblue',
    primary:  'bg-brand-primary/10 text-brand-primary',
    purple:   'bg-indigo-50 text-indigo-700',
    pending:  'bg-amber-50 text-amber-600',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

// Card
export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[30px] border border-white/80 bg-white/86 backdrop-blur-xl shadow-[0_24px_60px_rgba(145,158,171,0.14)] ${hover ? 'cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(145,158,171,0.18)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Input
export function Input({ label, error, className = '', icon, ...props }) {
  return (
    <div className="flex flex-col gap-0.5">
      {label && <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-muted">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">{icon}</span>}
        <input
          className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 h-8 rounded-lg border text-xs
            bg-[#fbfbff] border-brand-border/80 text-brand-text placeholder:text-brand-muted/70 shadow-[0_8px_20px_rgba(145,158,171,0.08)]
            focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10
            transition-colors ${error ? 'border-red-400' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  );
}

// Select
export function Select({ label, error, className = '', children, ...props }) {
  return (
    <div className="flex flex-col gap-0.5">
      {label && <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-muted">{label}</label>}
      <select
        className={`w-full h-8 px-3 rounded-lg border text-xs
          bg-[#fbfbff] border-brand-border/80 text-brand-text shadow-[0_8px_20px_rgba(145,158,171,0.08)]
          focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10
          transition-colors ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  );
}

// Textarea
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-0.5">
      {label && <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-muted">{label}</label>}
      <textarea
        rows={2}
        className={`w-full px-3 py-1.5 rounded-lg border text-xs resize-none
          bg-[#fbfbff] border-brand-border/80 text-brand-text placeholder:text-brand-muted/70 shadow-[0_8px_20px_rgba(145,158,171,0.08)]
          focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10
          transition-colors ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  );
}

// Spinner
export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <svg className={`animate-spin ${sizes[size]} ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// Modal
export function Modal({ open, onClose, title, children, size = 'md' }) {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`w-full ${sizes[size]} overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,249,255,0.96)_100%)] shadow-[0_30px_90px_rgba(15,23,42,0.18)]`}
          >
            <div className="flex items-center justify-between border-b border-brand-border/70 bg-brand-surface/65 px-6 py-5">
              <h2 className="font-display text-xl font-bold text-brand-text">{title}</h2>
              <button onClick={onClose} className="rounded-xl p-2 text-brand-muted hover:bg-white hover:text-brand-text transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 md:p-7">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Empty State
export function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon ? <div className="text-5xl mb-4">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-brand-text mb-1">{title}</h3>
      {description && <p className="text-sm text-brand-muted">{description}</p>}
    </div>
  );
}

// Stat Card
export function StatCard({ title, value, icon, color = 'primary', delta, subtitle }) {
  const colors = {
    primary: 'from-brand-primary to-brand-primary-light',
    green:   'from-green-600 to-green-500',
    blue:    'from-brand-skyblue to-blue-500',
    amber:   'from-amber-500 to-amber-400',
    red:     'from-red-600 to-red-500',
    purple:  'from-indigo-600 to-indigo-500',
    skyblue: 'from-brand-skyblue to-blue-500',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-card p-6 shadow-card"
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${colors[color] || colors.primary}`} />
      <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${colors[color] || colors.primary} opacity-10`} />
      {icon ? (
        <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${colors[color] || colors.primary} text-white text-lg shadow-sm`}>
          {icon}
        </div>
      ) : (
        <div className={`mb-5 h-1.5 w-14 rounded-full bg-gradient-to-r ${colors[color] || colors.primary}`} />
      )}
      <div className="mb-1 font-display text-3xl font-black leading-none text-brand-text">{value}</div>
      <div className="text-sm font-semibold text-brand-muted">{title}</div>
      {(delta || subtitle) && (
        <div className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-brand-muted">{delta || subtitle}</div>
      )}
    </motion.div>
  );
}

// Table
export function Table({ columns, data, loading, onRow }) {
  if (loading) return (
    <div className="flex justify-center py-16"><Spinner size="lg" className="text-brand-primary" /></div>
  );
  return (
    <div className="overflow-x-auto rounded-[26px] border border-brand-border/70 bg-white/78 scrollbar-thin">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-brand-border bg-brand-surface/55">
            {columns.map(c => (
              <th key={c.key} className="px-5 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-brand-muted whitespace-nowrap">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <motion.tr
              key={row.id || i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onRow && onRow(row)}
              className={`border-b border-brand-border/70 ${onRow ? 'cursor-pointer hover:bg-brand-surface/45' : 'hover:bg-brand-surface/30'} transition-colors`}
            >
              {columns.map(c => (
                <td key={c.key} className="px-5 py-4 text-brand-text align-top">
                  {c.render ? c.render(row[c.key], row) : row[c.key] ?? 'N/A'}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <EmptyState title="No records found" description="Try adjusting your filters." />}
    </div>
  );
}

export function PageHeader({ eyebrow = 'College Administration Portal', title, description, actions, meta }) {
  const layoutClass = actions ? 'lg:flex-row lg:items-start lg:justify-between' : '';

  return (
    <div className={`relative overflow-hidden flex flex-col gap-4 rounded-[34px] border border-white/80 bg-white/86 px-6 py-6 shadow-[0_26px_70px_rgba(145,158,171,0.14)] backdrop-blur-xl ${layoutClass}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(159,116,247,0.16),transparent_26%),radial-gradient(circle_at_right,rgba(3,136,252,0.08),transparent_20%)]" />
      <div className="min-w-0 max-w-4xl">
        <div className="relative inline-flex items-center rounded-full bg-brand-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-primary">
          {eyebrow}
        </div>
        <h1 className="relative mt-4 font-display text-3xl font-black tracking-tight text-brand-text md:text-[2.4rem]">{title}</h1>
        {description ? <p className="relative mt-2 max-w-3xl text-sm leading-relaxed text-brand-muted md:text-[15px]">{description}</p> : null}
        {meta ? <div className="relative mt-4">{meta}</div> : null}
      </div>
      {actions ? <div className="relative flex flex-wrap items-center gap-3 lg:justify-end lg:self-start">{actions}</div> : null}
    </div>
  );
}

export function SectionCard({ title, description, action, children, className = '' }) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      {(title || description || action) ? (
        <div className="flex flex-col gap-3 border-b border-brand-border/70 bg-[linear-gradient(180deg,rgba(247,248,253,0.95)_0%,rgba(247,248,253,0.76)_100%)] px-6 py-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            {title ? <h3 className="font-display text-xl font-bold text-brand-text">{title}</h3> : null}
            {description ? <p className="mt-1 text-sm leading-relaxed text-brand-muted">{description}</p> : null}
          </div>
          {action ? <div className="flex items-center gap-3 lg:pt-1">{action}</div> : null}
        </div>
      ) : null}
      <div className="p-6">{children}</div>
    </Card>
  );
}
