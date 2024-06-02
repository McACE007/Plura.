import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import { getLanesWithTicketAndTags, getPipelineDetails, updateLanesOrder, updateTicketsOrder } from "@/lib/queries";
import { LaneDetail } from "@/lib/types";
import { redirect } from "next/navigation";
import PipelineInfoBar from "../_components/PipelineInfoBar";
import PipelineSettings from "../_components/PipelineSettings";
import PipelineView from "../_components/PipelineView";
import BlurPage from "@/components/global/BlurPage";

type Props = {
  params: {
    subaccountId: string,
    pipelineId: string,
  };
}

export default async function PipelinePage({ params }: Props) {
  const pipelineDetails = await getPipelineDetails(params.pipelineId);

  if (!pipelineDetails) return redirect(`/subaccount/${params.subaccountId}/pipelines`)

  const pipelines = await db.pipeline.findMany({
    where: { subAccountId: params.subaccountId },
  })

  const lanes = (await getLanesWithTicketAndTags(params.pipelineId)) as LaneDetail[]

  return (
    <BlurPage>
      <Tabs className="w-full" defaultValue="view">
        <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
          <PipelineInfoBar pipelineId={params.pipelineId} subaccountId={params.subaccountId} pipelines={pipelines} />
          <div>
            <TabsTrigger value="view">
              Pipeline View
            </TabsTrigger>

            <TabsTrigger value="settings">
              Settings
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="view">
          <PipelineView
            lanes={lanes}
            pipelineDetails={pipelineDetails}
            pipelineId={params.pipelineId}
            subaccountId={params.subaccountId}
            updateLanesOrder={updateLanesOrder}
            updateTicketsOrder={updateTicketsOrder}
          />
        </TabsContent>

        <TabsContent value="settings">
          <PipelineSettings pipelineId={params.pipelineId} subaccountId={params.subaccountId} pipelines={pipelines} />
        </TabsContent>

      </Tabs>
    </BlurPage>
  )
}
