import StatsCard from "./StatsCard";

export default function Dashboard() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
            <StatsCard
                title="Recebidos"
                iconName="info"
                value={10}
                color="blue"
                bgColor="bg-blue-100"
            />
            <StatsCard
                title="Em aberto"
                iconName="info"
                value={10}
                color='#d97706'
                bgColor="bg-yellow-100"
            />
            <StatsCard
                title="Em adamento"
                iconName="info"
                value={10}
                color='red'
                bgColor="bg-red-100"
            />
            <StatsCard
                title="Pendentes"
                iconName="info"
                value={10}
                color='#9A3412'
                bgColor="bg-orange-100"
            />
            <StatsCard
                title="Resolvidos"
                iconName="info"
                value={10}
                color='green'
                bgColor="bg-green-100"
            />
        </div>

    );
}