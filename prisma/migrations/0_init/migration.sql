-- CreateTable
CREATE TABLE "sub_task" (
    "subtask_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "task_id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_finished" DATE,
    "deadline" DATE,

    CONSTRAINT "sub_task_pkey" PRIMARY KEY ("subtask_id")
);

-- CreateTable
CREATE TABLE "task" (
    "task_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_finished" DATE,
    "deadline" DATE,

    CONSTRAINT "task_pkey" PRIMARY KEY ("task_id")
);

-- AddForeignKey
ALTER TABLE "sub_task" ADD CONSTRAINT "fk_task" FOREIGN KEY ("task_id") REFERENCES "task"("task_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

