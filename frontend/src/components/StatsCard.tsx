import {
    BdsCard,
    BdsCardHeader,
    BdsCardTitle,
    BdsCardBody,
    BdsGrid,
    BdsCardFooter,
    BdsIcon,
} from "blip-ds/dist/blip-ds-react/components";

interface StatCardProps {
    title: string;
    value: number;
    iconName: string;
    color?: string;
    bgColor?: string;
}

export default function StatCard({ title, value, iconName, color = "primary", bgColor }: StatCardProps) {
    return (
        <div className="h-full">
            <BdsCard className="h-full w-full" style={{ height: '100%' }}>
                <BdsCardHeader align="center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${bgColor ?? "bg-gray-200"}`}>
                        <BdsIcon
                            size="medium"
                            name={iconName}
                            theme="outline"
                            style={{ color: color }} />
                    </div>
                    <BdsCardTitle text={title}></BdsCardTitle>
                </BdsCardHeader>
                <BdsCardBody>
                    <BdsGrid
                        direction="column"
                        xxs="12"
                        gap="1"
                        justify-content="center"
                        align-items="center"
                    >
                        {value}
                    </BdsGrid>
                </BdsCardBody>
                <BdsCardFooter />
            </BdsCard>
        </div>
    );
}
