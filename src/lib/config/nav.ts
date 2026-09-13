import type { SvelteComponentTyped } from 'svelte';
import type { IconEvents, IconProps, IconSlots } from 'lucide-svelte';
import {
	Bell,
	Building2,
	CalendarDays,
	CircleCheck,
	ClipboardList,
	Database,
	FileDown,
	FileText,
	GitBranch,
	Landmark,
	LayoutDashboard,
	Plane,
	Plug,
	ReceiptText,
	ScrollText,
	Settings,
	ShieldCheck,
	UserCog,
	Users,
	Wallet
} from 'lucide-svelte';
import type { Role } from '../types';

export interface NavItem {
	href: string;
	label: string;
	icon: new (
		options: ConstructorParameters<typeof SvelteComponentTyped>[0]
	) => SvelteComponentTyped<IconProps, IconEvents, IconSlots>;
}

export const ROLE_MENUS: Record<Role, { group: string; items: NavItem[] }[]> = {
	karyawan: [
		{
			group: 'Perjalanan',
			items: [
				{ href: '/', label: 'Dashboard', icon: LayoutDashboard },
				{ href: '/pengajuan', label: 'Pengajuan Perjalanan', icon: FileText },
				{ href: '/perjalanan-saya', label: 'Perjalanan Saya', icon: Plane },
				{ href: '/booking', label: 'Booking & Itinerary', icon: CalendarDays }
			]
		},
		{
			group: 'Keuangan',
			items: [
				{ href: '/uang-muka', label: 'Uang Muka', icon: Wallet },
				{ href: '/reimbursement', label: 'Reimbursement', icon: ReceiptText },
				{ href: '/settlement', label: 'Settlement', icon: ScrollText }
			]
		},
		{
			group: 'Umum',
			items: [{ href: '/notifikasi', label: 'Notifikasi', icon: Bell }]
		}
	],
	atasan: [
		{
			group: 'Persetujuan',
			items: [
				{ href: '/atasan', label: 'Dashboard', icon: LayoutDashboard },
				{ href: '/atasan/approval', label: 'Approval', icon: CircleCheck },
				{ href: '/atasan/delegasi', label: 'Delegasi', icon: UserCog },
				{ href: '/atasan/perjalanan-tim', label: 'Perjalanan Tim', icon: Users }
			]
		},
		{
			group: 'Analitik',
			items: [{ href: '/atasan/laporan', label: 'Laporan', icon: FileDown }]
		}
	],
	'admin-travel': [
		{
			group: 'Operasional',
			items: [
				{ href: '/admin-travel', label: 'Dashboard', icon: LayoutDashboard },
				{ href: '/admin-travel/request', label: 'Request Perjalanan', icon: ClipboardList },
				{ href: '/admin-travel/booking', label: 'Booking', icon: Plane },
				{ href: '/admin-travel/itinerary', label: 'Itinerary', icon: CalendarDays },
				{ href: '/admin-travel/vendor', label: 'Vendor Travel', icon: Building2 }
			]
		}
	],
	finance: [
		{
			group: 'Keuangan',
			items: [
				{ href: '/finance', label: 'Dashboard', icon: LayoutDashboard },
				{ href: '/finance/uang-muka', label: 'Uang Muka', icon: Wallet },
				{ href: '/finance/reimbursement', label: 'Reimbursement', icon: ReceiptText },
				{ href: '/finance/settlement', label: 'Settlement', icon: ScrollText },
				{ href: '/finance/pembayaran', label: 'Pembayaran', icon: Landmark }
			]
		},
		{
			group: 'Pelaporan',
			items: [{ href: '/finance/laporan', label: 'Laporan Keuangan', icon: FileDown }]
		}
	],
	superadmin: [
		{
			group: 'Administrasi',
			items: [
				{ href: '/superadmin', label: 'Dashboard', icon: LayoutDashboard },
				{ href: '/superadmin/master-data', label: 'Master Data', icon: Database },
				{ href: '/superadmin/pengguna', label: 'User & Role', icon: Users },
				{ href: '/superadmin/travel-policy', label: 'Travel Policy', icon: ShieldCheck },
				{ href: '/superadmin/workflow', label: 'Workflow & Approval', icon: GitBranch }
			]
		},
		{
			group: 'Sistem',
			items: [
				{ href: '/superadmin/vendor', label: 'Vendor Management', icon: Building2 },
				{ href: '/superadmin/integrasi', label: 'Integrasi', icon: Plug },
				{ href: '/superadmin/audit-log', label: 'Audit Log', icon: ScrollText },
				{ href: '/superadmin/laporan', label: 'Laporan', icon: FileDown },
				{ href: '/superadmin/pengaturan', label: 'Pengaturan', icon: Settings }
			]
		}
	]
};
