import { BdsGrid } from "blip-ds/dist/blip-ds-react/components";
import StatsCard from "./StatsCard";

export default function Dashboard() {
    return (
        <BdsGrid direction="row" flexWrap="wrap" gap="4" justifyContent="center">
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
        </BdsGrid>

    );
}