
import { FamilyMode } from "@/components/dashboard/family-mode";
import { FamilyChallenges } from "@/components/dashboard/family-challenges";
import { Separator } from "@/components/ui/separator";

export default function FamilyPage() {
    return (
        <div className="space-y-8">
            <FamilyMode />
            <Separator className="my-8" />
            <FamilyChallenges />
        </div>
    );
}

    