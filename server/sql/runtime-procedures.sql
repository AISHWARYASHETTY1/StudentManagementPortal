CREATE OR ALTER PROCEDURE dbo.CreateStudentWithLogin
    @FirstName VARCHAR(100),
    @LastName VARCHAR(100),
    @Email VARCHAR(150),
    @Phone VARCHAR(25) = NULL,
    @Department VARCHAR(100) = NULL,
    @Course VARCHAR(100) = NULL,
    @YearOfStudy INT = NULL,
    @JoiningDate DATE,
    @IsActive BIT,
    @PasswordHash VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @StudentId INT;
    DECLARE @StudentCode VARCHAR(20);
    DECLARE @NextCode INT;

    BEGIN TRANSACTION;

    SELECT @NextCode = ISNULL(MAX(TRY_CONVERT(INT, REPLACE(StudentCode, 'STU', ''))), 0) + 1
    FROM dbo.Students WITH (UPDLOCK, HOLDLOCK);

    SET @StudentCode = CONCAT('STU', RIGHT(CONCAT('000000', @NextCode), 6));

    INSERT INTO dbo.Students (
        StudentCode, FirstName, LastName, Email, Phone,
        Department, Course, YearOfStudy, JoiningDate, IsActive
    )
    VALUES (
        @StudentCode, @FirstName, @LastName, @Email, @Phone,
        @Department, @Course, @YearOfStudy, @JoiningDate, @IsActive
    );

    SET @StudentId = CAST(SCOPE_IDENTITY() AS INT);

    INSERT INTO dbo.StudentUsers (StudentId, PasswordHash, IsActive, CreatedAt)
    VALUES (@StudentId, @PasswordHash, @IsActive, GETDATE());

    COMMIT TRANSACTION;

    SELECT @StudentId AS StudentId, @StudentCode AS StudentCode;
END;
GO

CREATE OR ALTER PROCEDURE dbo.AddCourse
    @CourseCode VARCHAR(50),
    @CourseName VARCHAR(150),
    @Department VARCHAR(100) = NULL,
    @Credits INT,
    @IsActive BIT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Courses (CourseCode, CourseName, Department, Credits, IsActive)
    VALUES (@CourseCode, @CourseName, @Department, @Credits, @IsActive);

    SELECT CAST(SCOPE_IDENTITY() AS INT) AS CourseId;
END;
GO

CREATE OR ALTER PROCEDURE dbo.UpsertAttendance
    @StudentId INT,
    @CourseId INT,
    @AttendanceDate DATETIME2,
    @Status VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @AttendanceId INT;

    BEGIN TRANSACTION;

    SELECT TOP (1) @AttendanceId = AttendanceId
    FROM dbo.Attendance WITH (UPDLOCK, HOLDLOCK)
    WHERE StudentId = @StudentId
      AND CourseId = @CourseId
      AND AttendanceDate = @AttendanceDate;

    IF @AttendanceId IS NULL
    BEGIN
        INSERT INTO dbo.Attendance (StudentId, CourseId, AttendanceDate, Status)
        VALUES (@StudentId, @CourseId, @AttendanceDate, @Status);

        SET @AttendanceId = CAST(SCOPE_IDENTITY() AS INT);
    END
    ELSE
    BEGIN
        UPDATE dbo.Attendance
        SET Status = @Status
        WHERE AttendanceId = @AttendanceId;
    END

    COMMIT TRANSACTION;

    SELECT @AttendanceId AS AttendanceId;
END;
GO

CREATE OR ALTER PROCEDURE dbo.RecordAdminLogin
    @AdminId INT,
    @LastLogin DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Admins
    SET LastLogin = @LastLogin
    WHERE AdminId = @AdminId;
END;
GO

CREATE OR ALTER PROCEDURE dbo.RecordAdminPayment
    @StudentId INT,
    @Amount DECIMAL(10, 2),
    @PaymentMethod VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @PaymentId INT;

    BEGIN TRANSACTION;

    INSERT INTO dbo.Payments (StudentId, Amount, PaymentMethod)
    VALUES (@StudentId, @Amount, @PaymentMethod);

    SET @PaymentId = CAST(SCOPE_IDENTITY() AS INT);

    -- This retains the application's existing payment-status behavior.
    UPDATE dbo.Fees
    SET Status = 'Paid'
    WHERE StudentId = @StudentId
      AND Status = 'Pending';

    COMMIT TRANSACTION;

    SELECT @PaymentId AS PaymentId;
END;
GO
