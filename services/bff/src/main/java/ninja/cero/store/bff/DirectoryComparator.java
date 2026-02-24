package ninja.cero.store.bff;

import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Set;

public class DirectoryComparator {
    private static final Set<String> SKIPPED_DIRECTORIES = new HashSet<>();

    static {
        SKIPPED_DIRECTORIES.add("Mac_Photolibrary");
        // ここにスキップしたいディレクトリ名を追加できます
    }

    public static void main(String[] args) throws IOException {
        Path dir1 = Paths.get("/Volumes/HDCX-UT/BABYMETAL_Backup");
        Path dir2 = Paths.get("/Volumes/BABYMETAL");

        System.out.println("ファイルのフルパス,ファイル or ディレクトリ,不一致理由");
        compareDirectories(dir1, dir2);
    }

    public static void compareDirectories(Path dir1, Path dir2) throws IOException {
        Set<Path> visitedPaths = new HashSet<>();

        // Compare dir1 against dir2
        Files.walkFileTree(dir1, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                if (shouldSkipDirectory(dir)) {
                    return FileVisitResult.SKIP_SUBTREE;
                }

                Path relativePath = dir1.relativize(dir);
                Path correspondingPath = dir2.resolve(relativePath);

                compareFileAttributes(dir, correspondingPath);
                visitedPaths.add(relativePath);

                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                if (shouldSkipFile(file)) {
                    return FileVisitResult.CONTINUE;
                }

                Path relativePath = dir1.relativize(file);
                Path correspondingPath = dir2.resolve(relativePath);

                compareFileAttributes(file, correspondingPath);
                visitedPaths.add(relativePath);

                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult visitFileFailed(Path file, IOException exc) {
                System.err.printf("%s,ファイル,例外: %s%n", file, exc.getMessage());
                return FileVisitResult.CONTINUE;
            }
        });

        // Compare dir2 against dir1 to find missing files in dir1
        Files.walkFileTree(dir2, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
                if (shouldSkipDirectory(dir)) {
                    return FileVisitResult.SKIP_SUBTREE;
                }

                Path relativePath = dir2.relativize(dir);
                if (!visitedPaths.contains(relativePath)) {
                    System.out.printf("%s,ディレクトリ,存在しません%n", dir);
                    return FileVisitResult.SKIP_SUBTREE;
                }

                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                if (shouldSkipFile(file)) {
                    return FileVisitResult.CONTINUE;
                }

                Path relativePath = dir2.relativize(file);

                if (!visitedPaths.contains(relativePath)) {
                    System.out.printf("%s,ファイル,存在しません%n", file);
                }

                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult visitFileFailed(Path file, IOException exc) {
                System.err.printf("%s,ファイル,例外: %s%n", file, exc.getMessage());
                return FileVisitResult.CONTINUE;
            }
        });
    }

    private static boolean shouldSkipDirectory(Path dir) {
        String dirName = dir.getFileName().toString();
        return SKIPPED_DIRECTORIES.contains(dirName) || dirName.startsWith(".");
    }

    private static boolean shouldSkipFile(Path file) {
        String fileName = file.getFileName().toString();
        return fileName.startsWith(".");
    }

    private static void compareFileAttributes(Path path1, Path path2) throws IOException {
        if (!Files.exists(path2)) {
            System.out.printf("%s,%s,存在しません%n", path1, Files.isDirectory(path1) ? "ディレクトリ" : "ファイル");
            return;
        }

        BasicFileAttributes attr1 = Files.readAttributes(path1, BasicFileAttributes.class);
        BasicFileAttributes attr2 = Files.readAttributes(path2, BasicFileAttributes.class);

        if (attr1.isDirectory() && !attr2.isDirectory()) {
            System.out.printf("%s,ディレクトリ,対応するパスがファイルです%n", path1);
            return;
        }

        if (!attr1.isDirectory() && attr2.isDirectory()) {
            System.out.printf("%s,ファイル,対応するパスがディレクトリです%n", path1);
            return;
        }

        if (attr1.isDirectory()) {
            // ディレクトリ自体は比較の必要なし
            return;
        }

        if (attr1.size() != attr2.size()) {
            System.out.printf("%s,ファイル,サイズ不一致: %d vs %d%n", path1, attr1.size(), attr2.size());
            return;
        }

        if (attr1.lastModifiedTime().toInstant().truncatedTo(ChronoUnit.SECONDS)
                .equals(attr2.lastModifiedTime().toInstant().truncatedTo(ChronoUnit.SECONDS))) {
            // サイズも最終更新日も差異がなければ一致と見なす。ミリ秒の誤差は無視
            return;
        }

        if (attr1.lastModifiedTime().compareTo(attr1.creationTime()) < 0 || attr2.lastModifiedTime().compareTo(attr2.creationTime()) < 0) {
            // 最終更新日が異なる場合においても、最終更新日が作成日よりも前の場合は、作成日が一致しているかどうかだけ確認する
            // 特殊な状態だが、タイムスタンプのコピーの問題で、実際に発生している
            if (!attr1.creationTime().equals(attr2.creationTime())) {
                System.out.printf("%s,ファイル,作成日時不一致: %s vs %s%n", path1, attr1.creationTime(), attr2.creationTime());
            }
            return;
        }

        // 一時的に更新日時不一致を無視
        // System.out.printf("%s,ファイル,更新日時不一致: %s vs %s%n", path1, attr1.lastModifiedTime(), attr2.lastModifiedTime());
    }
}
