
// In the SidebarContent component, I'll remove the overflow-auto class

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2", // Removed overflow-auto
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"
