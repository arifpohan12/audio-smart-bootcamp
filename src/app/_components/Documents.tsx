"use client";

import { api } from "~/trpc/react";
import { UploadButton } from "~/utils/uploadthing";
import { Pages } from "./Pages";

export function Documents() {
  const { data: documents, refetch: refetchDocuments } =
    api.document.getAll.useQuery();

  const createDocument = api.document.create.useMutation({
    onSuccess: async () => {
      console.log("Document created successfully");
      await refetchDocuments();
    },
    onError: (error) => {
      console.error("Error creating document:", error);
    },
  });

  const deleteDocument = api.document.delete.useMutation({
    onSuccess: async () => {
      console.log("Document deleted succesfully");
      await refetchDocuments();
    },
    onError: (error) => {
      console.error("Error deleting document:", error);
    },
  });

  return (
    <div>
      <UploadButton
        endpoint="pdfUploader"
        onClientUploadComplete={async (res) => {
          if (!res?.[0]) return;
          console.log(res[0]);
          await createDocument.mutateAsync({
            fileUrl: res[0].url,
            name: res[0].name,
          });
        }}
        onUploadError={(error: Error) => {
          console.error(error.message);
        }}
        appearance={{
          button:
            "ut-ready:bg-green-500 ut-uploading:cursor-not-allowed bg-fuchsia-500 bg-none after:bg-fuchsia-400",
          container: "w-max flex-row mx-auto",
          allowedContent:
            "flex h-8 flex-col items-center justify-center px-2 text-white",
        }}
      />
      <div className="mt-8">
        {documents?.map((document) => (
          <div
            className="rounded-xl border bg-white/5 p-4 text-white"
            key={document.id}
          >
            <p>{document.name}</p>
            <button
              onClick={() => deleteDocument.mutate({ id: document.id })}
              className="bg-red-500 px-3 text-white hover:bg-red-400"
              disabled={deleteDocument.isPending}
            >
              {deleteDocument.isPending ? "Deleting..." : "Delete"}
            </button>
            <p>Pages</p>
            <Pages
              documentId={document.id}
              // documentName={document.name}
              pages={document.pages}
              refetchDocuments={refetchDocuments}
              voice={"NFG5qt843uXKj4pFvR7C"}
            />
            {/* {document.pages.map((page) => (
              <div key={page.id}>
                <p>Page {page.pageNumber}</p>
                <p>{page.content}</p>
              </div>
            ))} */}
          </div>
        ))}
      </div>
    </div>
  );
}
