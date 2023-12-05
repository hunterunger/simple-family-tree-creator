import AbrahamLineage from "@/examples/abraham-lineage.yaml";
import RoyalFamily from "@/examples/royal-family.yaml";
import FamilyGuy from "@/examples/family-guy-family-tree.yaml";

export default {
    // items
    child: "- Child\n",
    coupleNoChildren: "Mom + Dad:\n- none\n",
    coupleWithMarrageDate: "Mom + Dad [m. 1970]:\n- none\n",

    // templates
    basic: FamilyGuy + "\n",
    largeGeneology: AbrahamLineage + "\n",
    mediumGeneology: RoyalFamily + "\n",
};
