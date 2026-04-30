import { auth, signOut } from "@/auth";
import Link from "next/link";
import { BookOpen, BarChart3, Users, Settings, LogOut, CheckSquare, Pencil, LayoutDashboard, ShoppingBag } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { prisma } from "@/lib/db";
import { SHOP_ITEMS } from "@/lib/shop";

const MOCK_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=";

const studentItems = [
  { title: "Басты бет", url: "/student/dashboard", icon: LayoutDashboard },
  { title: "Тесттер", url: "/student/tests", icon: Pencil },
  { title: "Нәтижелер", url: "/student/results", icon: CheckSquare },
  { title: "Прогресс", url: "/student/progress", icon: BarChart3 },
  { title: "Дүкен (XP)", url: "/student/shop", icon: ShoppingBag },
  { title: "Жеке профиль", url: "/student/profile", icon: Settings },
];

const teacherItems = [
  { title: "Басты бет", url: "/teacher/dashboard", icon: LayoutDashboard },
  { title: "Оқушылар", url: "/teacher/students", icon: Users },
  { title: "Тапсырмалар", url: "/teacher/assessments", icon: BookOpen },
  { title: "Нәтижелер", url: "/teacher/results", icon: CheckSquare },
  { title: "Аналитика", url: "/teacher/analytics", icon: BarChart3 },
  { title: "Жеке профиль", url: "/teacher/profile", icon: Settings },
];

const adminItems = [
  { title: "Басты бет", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Пайдаланушылар", url: "/admin/users", icon: Users },
  { title: "Тапсырмалар", url: "/admin/tasks", icon: Pencil },
  { title: "Есептер", url: "/admin/reports", icon: BarChart3 },
];

export async function AppSidebar() {
  const session = await auth();
  const role = session?.user?.role || "student";
  const name = session?.user?.name || "Пайдаланушы";
  const dbUser = session?.user?.email ? await prisma.user.findUnique({ where: { email: session.user.email } }) : null;

  let items = studentItems;
  if (role === "teacher") items = teacherItems;
  if (role === "admin") items = adminItems;

  let avatarSrc = `${MOCK_AVATAR}${name}`;
  let borderClass = "";
  let titleText = role;
  
  if (dbUser?.equippedAvatar) {
    const item = SHOP_ITEMS.find(i => i.id === dbUser.equippedAvatar);
    if (item?.src) avatarSrc = item.src;
  }
  if (dbUser?.equippedBorder) {
    const item = SHOP_ITEMS.find(i => i.id === dbUser.equippedBorder);
    if (item?.cssClass) borderClass = item.cssClass;
  }
  if (dbUser?.equippedTitle) {
    const item = SHOP_ITEMS.find(i => i.id === dbUser.equippedTitle);
    if (item?.text) titleText = item.text;
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/50 p-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <span>🎯</span> EduKids
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground uppercase text-xs tracking-wider">
            {role === "student" ? "Оқушы" : role === "teacher" ? "Мұғалім" : "Әкімші"} Панелі
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} className="gap-3" />}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`size-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center ${borderClass}`}>
            <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col text-sm truncate">
            <span className="font-bold truncate text-base">{name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary font-medium tracking-wide truncate">{titleText}</span>
              <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-1.5 rounded-full flex items-center justify-center">🔥 {dbUser?.streakCount || 0}</span>
            </div>
          </div>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <SidebarMenuButton type="submit" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-3">
            <LogOut className="size-4" />
            <span>Шығу</span>
          </SidebarMenuButton>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
