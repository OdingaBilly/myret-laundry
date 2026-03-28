import { allServices } from '@/lib/services';

export default function AdminServices() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Services Management</h2>
        <p className="text-muted-foreground text-sm">All available laundry services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {allServices.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.slug} className="glass-card p-5 rounded-xl">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{service.name}</h3>
                  <p className="text-sm text-primary font-medium">{service.price}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>⏱ {service.turnaround}</span>
                <span>•</span>
                <span>{service.features.length} features</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
