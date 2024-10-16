CREATE TABLE [dbo].[Course] (
    [course_id]   INT           IDENTITY (1, 1) NOT NULL,
    [course_name] VARCHAR (255) NOT NULL,
    [description] TEXT          NULL,
    [creator_id]  INT           NOT NULL,
    [created_at]  DATETIME      DEFAULT (getdate()) NULL,
    [updated_at]  DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([course_id] ASC),
    FOREIGN KEY ([creator_id]) REFERENCES [dbo].[User] ([user_id]) ON DELETE CASCADE
);


GO

CREATE TABLE [dbo].[Submission_Status] (
    [status_id] INT          IDENTITY (1, 1) NOT NULL,
    [status]    VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([status_id] ASC)
);


GO

CREATE TABLE [dbo].[Admin_Activity] (
    [activity_id] INT           IDENTITY (1, 1) NOT NULL,
    [admin_id]    INT           NOT NULL,
    [action]      VARCHAR (255) NOT NULL,
    [target_type] VARCHAR (50)  NOT NULL,
    [target_id]   INT           NULL,
    [timestamp]   DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([activity_id] ASC),
    CHECK ([target_type]='Course' OR [target_type]='Problem' OR [target_type]='User'),
    FOREIGN KEY ([admin_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[PasswordReset] (
    [reset_id]    INT           IDENTITY (1, 1) NOT NULL,
    [user_id]     INT           NOT NULL,
    [reset_token] VARCHAR (255) NOT NULL,
    [created_at]  DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([reset_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Problem] (
    [problem_id]    INT           IDENTITY (1, 1) NOT NULL,
    [title]         VARCHAR (255) NOT NULL,
    [description]   TEXT          NOT NULL,
    [input_format]  TEXT          NULL,
    [output_format] TEXT          NULL,
    [constraints]   TEXT          NULL,
    [sample_input]  TEXT          NULL,
    [sample_output] TEXT          NULL,
    [time_limit]    INT           NULL,
    [memory_limit]  INT           NULL,
    [category_id]   INT           NOT NULL,
    [created_at]    DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([problem_id] ASC),
    CHECK ([memory_limit]>(0)),
    CHECK ([time_limit]>(0)),
    FOREIGN KEY ([category_id]) REFERENCES [dbo].[Category] ([category_id]) ON DELETE CASCADE
);


GO

CREATE TABLE [dbo].[Match] (
    [match_id]   INT          IDENTITY (1, 1) NOT NULL,
    [match_date] DATETIME     NOT NULL,
    [status]     VARCHAR (50) NOT NULL,
    [created_at] DATETIME     DEFAULT (getdate()) NULL,
    [updated_at] DATETIME     DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([match_id] ASC),
    CHECK ([status]='Completed' OR [status]='Ongoing' OR [status]='Pending')
);


GO

CREATE TABLE [dbo].[Blog] (
    [blog_id]    INT           IDENTITY (1, 1) NOT NULL,
    [author_id]  INT           NOT NULL,
    [title]      VARCHAR (255) NOT NULL,
    [content]    TEXT          NOT NULL,
    [created_at] DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([blog_id] ASC),
    FOREIGN KEY ([author_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Comment] (
    [comment_id] INT      IDENTITY (1, 1) NOT NULL,
    [user_id]    INT      NOT NULL,
    [problem_id] INT      NOT NULL,
    [content]    TEXT     NOT NULL,
    [created_at] DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([comment_id] ASC),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Ratings] (
    [rating_id] INT      IDENTITY (1, 1) NOT NULL,
    [user_id]   INT      NOT NULL,
    [course_id] INT      NOT NULL,
    [rating]    INT      NOT NULL,
    [comment]   TEXT     NULL,
    [rated_at]  DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([rating_id] ASC),
    CHECK ([rating]>=(1) AND [rating]<=(5)),
    FOREIGN KEY ([course_id]) REFERENCES [dbo].[Course] ([course_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Submission] (
    [submission_id] INT          IDENTITY (1, 1) NOT NULL,
    [user_id]       INT          NOT NULL,
    [problem_id]    INT          NOT NULL,
    [status]        VARCHAR (50) NOT NULL,
    [runtime]       INT          NULL,
    [memory_used]   INT          NULL,
    [score]         INT          NULL,
    [submitted_at]  DATETIME     DEFAULT (getdate()) NULL,
    [status_id]     INT          NOT NULL,
    [code]          TEXT         NOT NULL,
    [language]      VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([submission_id] ASC),
    CHECK ([language]='HTML/CSS' OR [language]='PHP' OR [language]='Swift' OR [language]='Go' OR [language]='JavaScript' OR [language]='C#' OR [language]='C++' OR [language]='C' OR [language]='Java' OR [language]='Python'),
    CHECK ([memory_used]>=(0)),
    CHECK ([runtime]>=(0)),
    CHECK ([score]>=(0)),
    CHECK ([status]='Compilation Error' OR [status]='Runtime Error' OR [status]='Wrong Answer' OR [status]='Accepted'),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id]),
    CONSTRAINT [fk_submission_status] FOREIGN KEY ([status_id]) REFERENCES [dbo].[Submission_Status] ([status_id])
);


GO

CREATE TABLE [dbo].[Class_Student] (
    [class_id]   INT      NOT NULL,
    [student_id] INT      NOT NULL,
    [joined_at]  DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([class_id] ASC, [student_id] ASC),
    FOREIGN KEY ([class_id]) REFERENCES [dbo].[Class] ([class_id]),
    FOREIGN KEY ([student_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Admin] (
    [admin_id]     INT      IDENTITY (1, 1) NOT NULL,
    [user_id]      INT      NOT NULL,
    [access_level] INT      NOT NULL,
    [created_at]   DATETIME DEFAULT (getdate()) NULL,
    [updated_at]   DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([admin_id] ASC),
    CHECK ([access_level]>=(1) AND [access_level]<=(10)),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Submission_TestCase_Result] (
    [result_id]     INT          IDENTITY (1, 1) NOT NULL,
    [submission_id] INT          NOT NULL,
    [testcase_id]   INT          NOT NULL,
    [status]        VARCHAR (50) NOT NULL,
    [runtime]       INT          NULL,
    [memory_used]   INT          NULL,
    [actual_output] TEXT         NULL,
    [error_message] TEXT         NULL,
    [graded_at]     DATETIME     DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([result_id] ASC),
    CHECK ([status]='Memory Limit Exceeded' OR [status]='Compilation Error' OR [status]='Time Limit Exceeded' OR [status]='Runtime Error' OR [status]='Wrong Answer' OR [status]='Accepted'),
    FOREIGN KEY ([submission_id]) REFERENCES [dbo].[Submission] ([submission_id]) ON DELETE CASCADE,
    FOREIGN KEY ([testcase_id]) REFERENCES [dbo].[Problem_TestCase] ([testcase_id]) ON DELETE CASCADE
);


GO

CREATE TABLE [dbo].[Category] (
    [category_id] INT           IDENTITY (1, 1) NOT NULL,
    [title]       VARCHAR (255) NOT NULL,
    [about]       TEXT          NULL,
    [created_at]  DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([category_id] ASC)
);


GO

CREATE TABLE [dbo].[Blog_Comment] (
    [comment_id] INT          IDENTITY (1, 1) NOT NULL,
    [blog_id]    INT          NOT NULL,
    [user_id]    INT          NOT NULL,
    [content]    TEXT         NOT NULL,
    [rank_flag]  VARCHAR (50) NULL,
    [created_at] DATETIME     DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([comment_id] ASC),
    FOREIGN KEY ([blog_id]) REFERENCES [dbo].[Blog] ([blog_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Match_User] (
    [match_user_id] INT IDENTITY (1, 1) NOT NULL,
    [match_id]      INT NOT NULL,
    [user_id]       INT NOT NULL,
    [score]         INT NULL,
    [rank_position] INT NULL,
    PRIMARY KEY CLUSTERED ([match_user_id] ASC),
    CHECK ([rank_position]>=(0)),
    CHECK ([score]>=(0)),
    FOREIGN KEY ([match_id]) REFERENCES [dbo].[Match] ([match_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[User_Badge] (
    [user_badge_id] INT      IDENTITY (1, 1) NOT NULL,
    [user_id]       INT      NOT NULL,
    [badge_id]      INT      NOT NULL,
    [awarded_at]    DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([user_badge_id] ASC),
    FOREIGN KEY ([badge_id]) REFERENCES [dbo].[Badge] ([badge_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Problem_Language] (
    [problem_id] INT          NOT NULL,
    [language]   VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([problem_id] ASC, [language] ASC),
    CHECK ([language]='HTML/CSS' OR [language]='PHP' OR [language]='Swift' OR [language]='Go' OR [language]='JavaScript' OR [language]='C#' OR [language]='C++' OR [language]='C' OR [language]='Java' OR [language]='Python'),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]) ON DELETE CASCADE
);


GO

CREATE TABLE [dbo].[Badge] (
    [badge_id]    INT           IDENTITY (1, 1) NOT NULL,
    [title]       VARCHAR (255) NOT NULL,
    [description] TEXT          NULL,
    [created_at]  DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([badge_id] ASC)
);

EXEC sp_help 'dbo.User_Role';

GO

CREATE TABLE [dbo].[QnA] (
    [question_id] INT      IDENTITY (1, 1) NOT NULL,
    [user_id]     INT      NOT NULL,
    [question]    TEXT     NOT NULL,
    [answer]      TEXT     NULL,
    [created_at]  DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([question_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);

use campushubt;
GO
DROP TABLE IF EXISTS [dbo].[User_Role]; -- Xóa bảng nếu nó tồn tại


CREATE TABLE [dbo].[User_Role] (
    [user_role_id] INT          IDENTITY (1, 1) NOT NULL,
    [user_id]      INT          NOT NULL,
    [role]         VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([user_role_id] ASC),
    CHECK ([role]='student' OR [role]='teacher' OR [role]='admin'),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[User] (
    [user_id]       INT           IDENTITY (1, 1) NOT NULL,
    [username]      VARCHAR (255) NOT NULL,
    [full_name]     VARCHAR (255) NULL,
    [address]       VARCHAR (255) NULL,
    [school]        VARCHAR (255) NULL,
    [email]         VARCHAR (255) NOT NULL,
    [phone_number]  VARCHAR (20)  NULL,
    [password_hash] VARCHAR (255) NOT NULL,
    [role]          VARCHAR (50)  NOT NULL,
    [created_at]    DATETIME      DEFAULT (getdate()) NULL,
    [updated_at]    DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([user_id] ASC),
    CHECK ([role]='student' OR [role]='teacher' OR [role]='admin'),
    CONSTRAINT [chk_email_format] CHECK ([email] like '%_@__%.__%'),
    UNIQUE NONCLUSTERED ([email] ASC),
    UNIQUE NONCLUSTERED ([username] ASC)
);


GO

CREATE TABLE [dbo].[Match_Rank] (
    [rank_id]       INT      IDENTITY (1, 1) NOT NULL,
    [match_id]      INT      NOT NULL,
    [user_id]       INT      NOT NULL,
    [total_score]   INT      NULL,
    [rank_position] INT      NULL,
    [created_at]    DATETIME DEFAULT (getdate()) NULL,
    [updated_at]    DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([rank_id] ASC),
    CHECK ([rank_position]>=(0)),
    CHECK ([total_score]>=(0)),
    FOREIGN KEY ([match_id]) REFERENCES [dbo].[Match] ([match_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Course_Student] (
    [course_id]  INT          NOT NULL,
    [student_id] INT          NOT NULL,
    [joined_at]  DATETIME     DEFAULT (getdate()) NULL,
    [role]       VARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([course_id] ASC, [student_id] ASC),
    CHECK ([role]='student' OR [role]='instructor'),
    FOREIGN KEY ([course_id]) REFERENCES [dbo].[Course] ([course_id]),
    FOREIGN KEY ([student_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Notifications] (
    [notification_id] INT      IDENTITY (1, 1) NOT NULL,
    [course_id]       INT      NOT NULL,
    [sender_id]       INT      NOT NULL,
    [message]         TEXT     NOT NULL,
    [created_at]      DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([notification_id] ASC),
    FOREIGN KEY ([course_id]) REFERENCES [dbo].[Course] ([course_id]),
    FOREIGN KEY ([sender_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Audit_Log] (
    [log_id]     INT           IDENTITY (1, 1) NOT NULL,
    [table_name] VARCHAR (255) NOT NULL,
    [action]     VARCHAR (50)  NOT NULL,
    [user_id]    INT           NOT NULL,
    [timestamp]  DATETIME      DEFAULT (getdate()) NOT NULL,
    [changes]    TEXT          NULL,
    PRIMARY KEY CLUSTERED ([log_id] ASC)
);


GO

CREATE TABLE [dbo].[Problem_TestCase] (
    [testcase_id]     INT      IDENTITY (1, 1) NOT NULL,
    [problem_id]      INT      NOT NULL,
    [input_data]      TEXT     NOT NULL,
    [expected_output] TEXT     NOT NULL,
    [created_at]      DATETIME DEFAULT (getdate()) NULL,
    [points]          INT      DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([testcase_id] ASC),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]) ON DELETE CASCADE
);


GO

CREATE TABLE [dbo].[Assignment_Manager] (
    [manager_id]      INT      IDENTITY (1, 1) NOT NULL,
    [manager_user_id] INT      NOT NULL,
    [student_user_id] INT      NOT NULL,
    [problem_id]      INT      NOT NULL,
    [assigned_at]     DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([manager_id] ASC),
    FOREIGN KEY ([manager_user_id]) REFERENCES [dbo].[User] ([user_id]),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]),
    FOREIGN KEY ([student_user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Error_Report] (
    [report_id]     INT      IDENTITY (1, 1) NOT NULL,
    [user_id]       INT      NOT NULL,
    [error_message] TEXT     NOT NULL,
    [created_at]    DATETIME DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([report_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Class] (
    [class_id]   INT           IDENTITY (1, 1) NOT NULL,
    [class_name] VARCHAR (255) NOT NULL,
    [teacher_id] INT           NOT NULL,
    [created_at] DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([class_id] ASC),
    FOREIGN KEY ([teacher_id]) REFERENCES [dbo].[User] ([user_id])
);


GO

CREATE TABLE [dbo].[Rank] (
    [rank_id]        INT            IDENTITY (1, 1) NOT NULL,
    [user_id]        INT            NOT NULL,
    [category_id]    INT            NOT NULL,
    [total_score]    INT            NULL,
    [detailed_score] NVARCHAR (MAX) NULL,
    [rank_position]  INT            NULL,
    [updated_at]     DATETIME       DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([rank_id] ASC),
    CHECK ([rank_position]>=(0)),
    CHECK ([total_score]>=(0)),
    FOREIGN KEY ([category_id]) REFERENCES [dbo].[Category] ([category_id]),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id])
);

CREATE TABLE [dbo].[Learning_Progress] (
    [progress_id]    INT          IDENTITY (1, 1) NOT NULL,
    [user_id]        INT          NOT NULL,
    [course_id]      INT          NOT NULL,
    [problem_id]     INT          NULL,
    [status]         VARCHAR (50) NOT NULL, -- Trạng thái như 'Not Started', 'In Progress', 'Completed'
    [progress_percentage] INT         NOT NULL CHECK (progress_percentage >= 0 AND progress_percentage <= 100), -- Tiến độ (%)
    [updated_at]     DATETIME      DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([progress_id] ASC),
    FOREIGN KEY ([user_id]) REFERENCES [dbo].[User] ([user_id]),
    FOREIGN KEY ([course_id]) REFERENCES [dbo].[Course] ([course_id]),
    FOREIGN KEY ([problem_id]) REFERENCES [dbo].[Problem] ([problem_id]) -- Nếu có bài tập liên quan
);

GO

CREATE NONCLUSTERED INDEX [idx_comment_user_problem]
    ON [dbo].[Comment]([user_id] ASC, [problem_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_problem_id]
    ON [dbo].[Submission]([problem_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_class_student]
    ON [dbo].[Class_Student]([class_id] ASC, [student_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_match_user]
    ON [dbo].[Match_User]([match_id] ASC, [user_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_user_problem]
    ON [dbo].[Submission]([user_id] ASC, [problem_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_user_course]
    ON [dbo].[Ratings]([user_id] ASC, [course_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_user_id]
    ON [dbo].[Error_Report]([user_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_problem_id]
    ON [dbo].[Problem_TestCase]([problem_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_user_id]
    ON [dbo].[Submission]([user_id] ASC);


GO

CREATE NONCLUSTERED INDEX [idx_class_teacher]
    ON [dbo].[Class]([teacher_id] ASC);


GO

CREATE COLUMNSTORE INDEX [idx_submission_columnstore]
    ON [dbo].[Submission]([score], [runtime], [memory_used]);


GO

CREATE PROCEDURE [dbo].[GetUserSubmissions]
    @user_id INT
AS
BEGIN
    SELECT submission_id, problem_id, status, score, submitted_at
    FROM [dbo].[Submission]
    WHERE user_id = @user_id;
END;

GO


CREATE PROCEDURE [dbo].[UpdateUserRole]
    @admin_id INT,
    @user_id INT,
    @new_role VARCHAR(50)
AS
BEGIN
    DECLARE @isAdmin INT;
    SELECT @isAdmin = COUNT(*) FROM [dbo].[Admin] WHERE [user_id] = @admin_id;

    IF @isAdmin = 0
    BEGIN
        RAISERROR('Only admins can update user roles.', 16, 1);
        RETURN;
    END

    IF @new_role NOT IN ('student', 'teacher', 'admin')
    BEGIN
        RAISERROR('Invalid role specified.', 16, 1);
        RETURN;
    END

    UPDATE [dbo].[User]
    SET [role] = @new_role
    WHERE [user_id] = @user_id;
END;

GO

CREATE TRIGGER trg_user_deletion
ON [dbo].[User]
FOR DELETE
AS
BEGIN
    INSERT INTO [dbo].[Audit_Log] (table_name, action, user_id, changes)
    SELECT 'User', 'DELETE', deleted.user_id, CONCAT('Deleted user ', deleted.username)
    FROM deleted;
END;

GO

CREATE TABLE Likes (
    LikeID INT PRIMARY KEY IDENTITY(1,1),    -- ID tự tăng cho mỗi lần like
    Blog_ID INT NOT NULL,                 -- Khóa ngoại liên kết đến bảng bài viết
    UserID INT NOT NULL,                     -- Khóa ngoại liên kết đến bảng người dùng
    LikeDate DATETIME DEFAULT GETDATE(),     -- Thời gian khi người dùng nhấn like
    CONSTRAINT FK_Blog_Likes FOREIGN KEY (Blog_ID) 
        REFERENCES Blog(Blog_ID) 
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION,                 -- Xóa hoặc cập nhật sẽ không tự động cascade
    CONSTRAINT FK_User_Likes FOREIGN KEY (UserID) 
        REFERENCES [User](User_ID) 
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION
);

CREATE TABLE Shares (
    ShareID INT PRIMAR
    Y KEY IDENTITY(1,1),    -- ID tự tăng cho mỗi lần chia sẻ
    Blog_ID INT NOT NULL,                      -- Khóa ngoại liên kết đến bảng bài viết
    UserID INT NOT NULL,                       -- Khóa ngoại liên kết đến bảng người dùng
    ShareDate DATETIME DEFAULT GETDATE(),      -- Thời gian khi người dùng nhấn chia sẻ
    CONSTRAINT FK_Blog_Shares FOREIGN KEY (Blog_ID) 
        REFERENCES Blog(Blog_ID)               -- Tham chiếu đến cột Blog_ID trong bảng Blog
        ON DELETE NO ACTION                     -- Không tự động xóa các lượt chia sẻ khi bài viết bị xóa
        ON UPDATE NO ACTION,                    -- Không tự động cập nhật khi ID bài viết thay đổi
    CONSTRAINT FK_User_Shares FOREIGN KEY (UserID) 
        REFERENCES [User](User_ID)              -- Tham chiếu đến cột User_ID trong bảng User
        ON DELETE NO ACTION                     -- Không tự động xóa các lượt chia sẻ khi người dùng bị xóa
        ON UPDATE NO ACTION                     -- Không tự động cập nhật khi ID người dùng thay đổi
);